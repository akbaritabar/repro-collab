module.exports = async function ({ github, context, core, env }) {

    const updatedBody17 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*17\..*)$/m, '$1x]$2');

    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody17,
        state: 'open'
    });

    // Simple completion message
    const milestone17BodyLines = [
        '✅ **Milestone 17 complete!**',
        '',
        'You now understand how to force a complete review of a file by removing and re-adding it.',
        '',
        '**Key insight:** Sometimes you need reviewers to read an entire file carefully rather than just looking at diffs. The remove-and-re-add technique ensures every line appears as "new" in the PR, forcing thorough review.',
        '',
        '*To be honest with you, we can\'t automatically check this milestone, so we trust you that you have done it.*'
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone17BodyLines.join('\n')
    });
}
