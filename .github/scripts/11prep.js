module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');
    const trackingIssueUrl = context.payload.issue.html_url;

    const body11 = [
        '**Task**: Execute code in the cloud',
        '',
        'You may have noticed that we have avoided using local software to edit files or interact with Git (spoiler: this will be part of a longer workshop).',
        'Still, there is something almost as good, an IDE/VS Code in the browser.',
        'To enable that either:',
        '* type `.` (literal dot on your keyboard) while you in the code or PR view',
        '* replace `github.com` with `github.dev` in the URL',
        `* https://github.dev/${owner}/${repo}/`,
        '',
        `<img src="https://${context.repo.owner}.github.io/${context.repo.repo}/assets/web_VS.gif" alt="VS_Web">`,
        '',
        'You may have seen this interface already, however, we can go even further and enable not only editing but also code execution in the cloud.',
        '',
        'In the lower left corner click on `GitHub` then `Create New Code Space` then `<your-fork-name>` then `main` and then `2 cores, 8GB RAM, 32GB storage` (but it doesn\'t matter). Do not worry about the "paid for ..." part you have at least 120h (Okt 2025) for free.',
        '',
        'Now you can open a terminal and actually run code which will be handy for some of the other milestones here. To run R code you would need to install R first (which is possible but not quite accessible enough for this workshop.)',
        'Try typing `git status` in the terminal.',
        '',
        'Another cool (and fully optional feature) is "Live sharing". Let\'s try it out.',
        'In the left icon line there is a button "Extensions" (the four blocks). Click on it and search for "Live Share". Install the extension from the author "Microsoft".',
        'Now, a new symbol appeared in the left icon line (the arrow). Click on it and start a live sharing session! One user shares their session, the other joins. This way you can code live together. However, remember it is basically as if you are sitting at the same computer so all git actions etc. will be on behalf of whoever shares their session.',
        '',
        `**When done:** Comment \`/done 11\` [in the tracking issue](${trackingIssueUrl})`
    ]


    await github.rest.issues.create({
        owner: owner,
        repo: repo,
        title: '[optional] Milestone 11: Learn about GitHub Codespaces - 🟡 Medium',
        body: body11.join('\n'),
        labels: ['enhancement']
    });
}