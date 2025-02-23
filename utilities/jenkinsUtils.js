const axios = require('axios');
const nodemailer = require('nodemailer');
const JENKINS_URL = 'http://jenkins:8080';
const JENKINS_USERNAME = process.env.JENKINS_USERNAME || 'your username';
const JENKINS_TOKEN = process.env.JENKINS_TOKEN || 'ypur token';
const JENKINS_PASSWORD = 'your password';

async function getJenkinsCrumb() {
    try {
        const response = await axios.get('http://jenkins:8080/crumbIssuer/api/json', {
            auth: {
                username: JENKINS_USERNAME,
                password: JENKINS_TOKEN
            }
        });
        return response.data.crumb;
    } catch (error) {
        console.error('Error while importing Crumb :', error.message);
        throw new Error('Crumb could not be retrieved');
    }
}
async function sendEmail(subject, message) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your mail',
            pass: 'your token'
        }
    });

    let mailOptions = {
        from: 'ypur mail',
        to: 'other mail',
        subject: subject,
        text: message
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.error('Email sent: ' + info.response);
    } catch (error) {
        console.error('Email sending error : ', error);
    }
}


async function triggerJenkinsBuild(testPath, testName) {
    try {
        console.log(`🚀 [triggerJenkinsBuild] Triggering Jenkins build for test: ${testPath}`);

        const crumb = await getJenkinsCrumb();
        console.log(`🔑 [triggerJenkinsBuild] Jenkins Crumb received: ${crumb}`);

        const buildResponse = await axios.post(`${JENKINS_URL}/job/playwrightTest/buildWithParameters`, null, {
            params: { TEST_PATH: testPath, TEST_NAME: testName},
            auth: { username: JENKINS_USERNAME, password: JENKINS_TOKEN },
            headers: { 'Jenkins-Crumb': crumb }
        });

        console.log(`📨 [triggerJenkinsBuild] Jenkins build request sent. Status: ${buildResponse.status}`);

        if (buildResponse.status !== 201) {
            console.error(`❌ [triggerJenkinsBuild] Failed to trigger Jenkins job. Status: ${buildResponse.status}`);
            return null;
        }

        const queueLocation = buildResponse.headers.location;
        console.log(`🔄 [triggerJenkinsBuild] Build queued at: ${queueLocation}`);

        if (!queueLocation) {
            console.error(`❌ [triggerJenkinsBuild] Could not determine queue location.`);
            return null;
        }

        let buildNumber = null;
        for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 6000));

            const queueResponse = await axios.get(`${queueLocation}api/json`, {
                auth: { username: JENKINS_USERNAME, password: JENKINS_TOKEN }
            });

            if (queueResponse.data.executable) {
                buildNumber = queueResponse.data.executable.number;
                console.log(`✅ [triggerJenkinsBuild] Build started: ${buildNumber}`);
                break;
            }

            console.log(`⏳ [triggerJenkinsBuild] Waiting for build to start...`);
        }

        if (!buildNumber) {
            console.error(`❌ [triggerJenkinsBuild] Could not determine build number.`);
            return null;
        }

        return `${JENKINS_URL}/job/playwrightTest/${buildNumber}/api/json`;

    } catch (error) {
        console.error(`🔥 [triggerJenkinsBuild] Error occurred: ${error.message}`);
        return null;
    }
}


async function checkJenkinsBuildStatus(jobUrl, nodeId = 50) {
    try {
        console.log(`🔄 [checkJenkinsBuildStatus] Checking build status: ${jobUrl}`);

        const response = await axios.get(jobUrl, {
            auth: { username: JENKINS_USERNAME, password: JENKINS_TOKEN }
        });

        const { result, building } = response.data;
        console.log(`📊 [checkJenkinsBuildStatus] Build Status: result=${result}, building=${building}`);

        const pipelineLogUrl = `${jobUrl.replace('/api/json', `/pipeline-console/log?nodeId=${nodeId}`)}`;
        let logs = '';

        if (!building) {
            try {
                const logResponse = await axios.get(pipelineLogUrl, {
                    auth: { username: JENKINS_USERNAME, password: JENKINS_TOKEN }
                });

                logs = logResponse.data;
                console.log(`📜 [checkJenkinsBuildStatus] Logs retrieved successfully.`);

            } catch (logError) {
                console.error(`❌ [checkJenkinsBuildStatus] Failed to retrieve logs: ${logError.message}`);
                logs = 'Error retrieving logs.';
            }
        }

        return { result, building, logs, pipelineLogUrl };

    } catch (error) {
        console.error(`🔥 [checkJenkinsBuildStatus] Error getting Jenkins build status: ${error.message}`);
        return { result: 'ERROR', building: false, logs: `Error: ${error.message}` };
    }
}



module.exports = { getJenkinsCrumb, triggerJenkinsBuild, checkJenkinsBuildStatus, sendEmail };
