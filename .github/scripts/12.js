module.exports = async function ({ github, context, core, env }) {
    
    const updatedBody12 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*12\..*)$/m, '$1x]$2');
    
    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody12,
        state: 'open'
    });
    
    // Simple completion message
    const milestone12BodyLines = [
        '✅ **Milestone 12 complete!**',
        '',
        'You now understand how to manage private/public repository workflows for professional review processes.',
        '',
        '**Key insight:** Separate internal discussions from public-facing content.',
        '',
        '*To be honest with you, we can\'t automatically check this milestone, so we trust you that you have done it.*'
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone12BodyLines.join('\n')
    });
}