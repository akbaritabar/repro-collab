module.exports = async function ({ github, context, core, env }) {

    const updatedBody16 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*16\..*)$/m, '$1x]$2');

    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody16,
        state: 'open'
    });

    // Simple completion message
    const milestone16BodyLines = [
        '✅ **Milestone 16 complete!**',
        '',
        'You now understand how to navigate Git history and "time travel" through your project\'s past.',
        '',
        '**Key insight:** Git preserves your entire project history, allowing you to view, restore, or undo any previous state—essential for recovering from mistakes and understanding how your work evolved.',
        '',
        '*To be honest with you, we can\'t automatically check this milestone, so we trust you that you have done it.*'
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone16BodyLines.join('\n')
    });
}
