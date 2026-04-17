module.exports = async function ({ github, context, core, env }) {
    
    const updatedBody11 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*11\..*)$/m, '$1x]$2');
    
    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody11,
        state: 'open'
    });
    
    // Simple completion message
    const milestone11BodyLines = [
        '✅ **Milestone 11 complete!**',
        '',
        'You now understand how to create and use GitHub Codespaces',
        '',
        '**Key insight:** You can use a terminal in the browser! This will be handy for the following milestones.',
        '',
        '*To be honest with you, we can\'t automatically check this milestone, so we trust you that you have done it.*'
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone11BodyLines.join('\n')
    });
}