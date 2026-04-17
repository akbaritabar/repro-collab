module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');

    // Check if there's an open PR from fork to upstream
    let foundValidPR = false;
    let prDetails = null;

    try {
        // Get upstream owner from context
        const upstreamOwner = context.repo.owner;
        const upstreamRepo = context.repo.repo;

        // List open PRs to upstream
        const { data: prs } = await github.rest.pulls.list({
            owner: upstreamOwner,
            repo: upstreamRepo,
            state: 'open',
            head: `${owner}:main` // PRs from fork's main branch
        });

        // Check each PR for CSV files in data/
        for (const pr of prs) {
            const { data: files } = await github.rest.pulls.listFiles({
                owner: upstreamOwner,
                repo: upstreamRepo,
                pull_number: pr.number
            });

            // Check if all changes are adding CSV files to data/
            const allValidChanges = files.length > 0 && files.every(file => {
                const isInDataFolder = file.filename.startsWith('data/');
                const isCsvFile = file.filename.endsWith('.csv');
                const isAddition = file.status === 'added';

                return isInDataFolder && isCsvFile && isAddition;
            });

            if (allValidChanges) {
                foundValidPR = true;
                prDetails = {
                    number: pr.number,
                    url: pr.html_url,
                    fileCount: files.length
                };
                break;
            }
        }

        if (!foundValidPR) {
            await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: '❌ **Milestone 18 not complete yet!**\n\n' +
                      'No valid PR found. Please create a PR from your fork to upstream that:\n' +
                      '- Only adds CSV files to the `data/` folder\n' +
                      '- Contains your cherry-picked data commits\n\n' +
                      'Follow the instructions in the milestone issue.'
            });
            return;
        }
    } catch (error) {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: `❌ **Error checking for PR**: ${error.message}\n\n` +
                  'Make sure you have created a PR from your fork to upstream with only CSV files in data/.'
        });
        return;
    }

    // Mark milestone complete
    const updatedBody18 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*18\..*)$/m, '$1x]$2');

    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody18,
        state: 'open'
    });

    // Success message
    const milestone18BodyLines = [
        '✅ **Milestone 18 complete!**',
        '',
        `Great work! We found your PR: ${prDetails.url}`,
        `You successfully cherry-picked ${prDetails.fileCount} data file${prDetails.fileCount > 1 ? 's' : ''}.`,
        '',
        'You now understand how to use cherry-pick to create selective PRs containing only specific commits.',
        '',
        '**Key insight:** Cherry-picking allows you to extract specific commits from your history and apply them elsewhere—perfect for contributing just data files, bug fixes, or specific features without including unrelated changes.'
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone18BodyLines.join('\n')
    });
}
