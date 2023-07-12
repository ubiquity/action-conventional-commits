const { context } = require("@actions/github");
const core = require("@actions/core");

import isValidCommitMessage from "./isValidCommitMesage.mjs";
import extractCommits from "./extractCommits";

async function run() {
    core.info(
        `ℹ️ Checking if commit messages are following the Conventional Commits specification...`
    );

    const extractedCommits = await extractCommits(context, core);
    if (extractedCommits.length === 0) {
        core.info(`No commits to check, skipping...`);
        return;
    }

    let hasErrors;
    core.startGroup("Commit messages:");
    // I will keep this code here for people that maybe want to check all the comments
    // for (let i = 0; i < extractedCommits.length; i++) {
    //     let commit = extractedCommits[i];
    //     if (isValidCommitMessage(commit.message)) {
    //         core.info(`✅ ${commit.message}`);
    //     } else {
    //         core.info(`🚩 ${commit.message}`);
    //         hasErrors = true;
    //     }
    // }

    // Check ONLY the latest commit
    let commit = extractedCommits[extractedCommits.length - 1];
    if (isValidCommitMessage(commit.message)) {
        core.info(`✅ ${commit.message}`);
    } else {
        core.info(`🚩 ${commit.message}`); 
        hasErrors = true;
    }

    core.endGroup();

    if (hasErrors) {
        core.setFailed(
            `🚫 According to the conventional-commits specification, some of the commit messages are not valid.`
        );
    } else {
        core.info("🎉 All commit messages are following the Conventional Commits specification.");
    }
}

run();
