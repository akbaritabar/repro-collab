module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');
    
    // Find the PR first
    const { data: prs } = await github.rest.pulls.list({
        owner, repo,
        state: 'all',
        per_page: 20,
        sort: 'created',
        direction: 'desc'
    });
    
    const ourPr = prs.find(pr =>
        pr.title === 'Review this preregistration update'
    );
    
    // Check if preregistration.md file exists in the fork
    let preregExists = false;
    try {
        const { data: file } = await github.rest.repos.getContent({
            owner, repo,
            path: 'preregistration.md'
        });
        preregExists = true;
    } catch (error) {
        // File doesn't exist
    }
    
    if (!preregExists) {
        const prUrl = ourPr ? ourPr.html_url : `https://github.com/${owner}/${repo}/pulls`;
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: `🚫 Milestone 7 not complete.\nPlease merge or close the pull request: ${prUrl}. Make sure all checks have passed, then click "Merge pull request" and run \`/done 7\` again.`
        });
        return;
    }
    
    // Cross off “7.”, reveal “8.”
    const updatedBody7 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*7\..*)$/m, '$1x]$2')
    + '\n- [ ] 8. Discuss Githubs functionality  - 🟢 Easy';
    
    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody7,
        state: 'open'
    });
    
    // Final success comment
    const workshopCompleteLines = [
        `🎉 **Congratulations @${context.actor}!** 🎉`,
        '',
        'You completed everything you can do alone:',
        '',
        'You\'ve mastered:',
        '- ✅ Forking repositories',
        '- ✅ Handling issues',
        '- ✅ Reviewing & merging PRs',
        '',
        'Now we can start with the collaborative part of the workshop!',  
        'Before you dive into editing text together, take a moment to discuss some things first.',  
        '',  
        'If your partner needs a bit more time to catch up on their milestones — everyone moves at a different pace — you can already start discussing with others around you who are ready. (Eavesdropping is also allowed!)',  
        '',  
        '**Task**: Discuss with your partner (or the people around you) the following questions:',
        '',
        ' * What makes an ideal issue?',
        ' * How can issues be used to organize tasks and responsibilities?',
        ' * Imagine you want to give feedback to your student, collaborator, etc. how do usually provide it? How could you use GitHub?',
        ' * What can you use PRs for?',
        ' * What aspects of your workflow are difficult to translate to GitHub?',
        '',
        '**Plenum discussion**',
        '',
        'We will reconvene in the plenum to discuss these issues.',
        '',
        `**After the plenum discussion**: comment \`/done 8\` here.`
    ];
    
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: workshopCompleteLines.join('\n')
    });
}
