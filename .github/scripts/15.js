module.exports = async function ({ github, context, core, env }) {

    const updatedBody15 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*15\..*)$/m, '$1x]$2');

    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody15,
        state: 'open'
    });

    // Simple completion message
    const milestone15BodyLines = [
        '✅ **Milestone 15 complete!**',
        '',
        'You now have a deeper understanding of Git branching, merging, rebasing, and the underlying concepts.',
        '',
        '**Key insight:** Git is a powerful version control system, and understanding how branches work unlocks its full potential for managing complex collaborative workflows.',
        '',
        '*To be honest with you, we can\'t automatically check this milestone, so we trust you that you have done it.*'
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone15BodyLines.join('\n')
    });
}
