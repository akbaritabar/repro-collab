module.exports = async function ({ github, context, core, env }) {

    const updatedBody19 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*19\..*)$/m, '$1x]$2');

    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody19,
        state: 'open'
    });

    // Simple completion message
    const milestone19BodyLines = [
        '✅ **Milestone 19 complete!**',
        '',
        'You now understand how to create releases and tags to mark important milestones in your research projects.',
        '',
        '**Key insight:** Releases and tags create permanent snapshots of your project at specific points in time—essential for reproducibility, citations, and archiving research milestones like preprints, submissions, and publications.',
        '',
        '*To be honest with you, we can\'t automatically check this milestone, so we trust you that you have done it.*'
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone19BodyLines.join('\n')
    });
}
