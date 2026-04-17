module.exports = async function ({ github, context, env }) {
  const milestone = env.MILESTONE || '?';
  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: [
      `⚠️ **Workflow Error - Milestone ${milestone}**`,
      '',
      `Something went wrong on our side while processing your \`/done ${milestone}\` command.`,
      'This is likely a technical issue with our automation system.',
      '',
      '**What to do:**',
      '- Get the attention of one of the workshop organizers so that they can look into it.',
      '- Give us the issue number of the tracking issue or/and your username.',
      '',
      '*This is an automated error notification.*'
    ].join('\n')
  });
};