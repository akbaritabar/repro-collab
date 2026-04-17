module.exports = async function ({ github, context, core, env }) {
    
    const updatedBody13 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*13\..*)$/m, '$1x]$2');
    
    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody13,
        state: 'open'
    });
    
    // Simple completion message
    const milestone13BodyLines = [
        '✅ **Milestone 13 complete!**',
        '',
        'You now understand how to track other peoples contributions in git.',
        '',
        '**Key insight:** Not everyone in a team needs to know git.',
        '',
        '*To be honest with you, we can\'t automatically check this milestone, so we trust you that you have done it.*'
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone13BodyLines.join('\n')
    });
}