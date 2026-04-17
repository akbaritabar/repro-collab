// .github/scripts/3.js

module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');
    const { data } = await github.rest.repos.get({ owner, repo });
    
    if (!data.has_issues) {
        // failure feedback only
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: '🚫 Milestone 3 not complete.\n\nPlease enable Issues on your fork, then `/done 3` again.'
        });
    } else {
        // 1) Cross off milestone 3 in the upstream issue body
        let updatedBody = context.payload.issue.body
        .replace(/^(\s*-\s*\[)\s\](\s*3\..*)$/m, '$1x]$2')
        .replace(/\n*<img[^>]*>.*$/m, '\n- [ ] 4. Create an issue - 🟢 Easy');
        
        await github.rest.issues.update({
            owner: context.repo.owner,
            repo:  context.repo.repo,
            issue_number: context.issue.number,
            body: updatedBody,
            state: 'open'
        });
        
        // 3) Create a new issue in the fork for them to "create your own first issue"
        const preregistrationUrl = context.payload.issue.html_url;
        const issueBodyLines = [
            'Great work on enabling issues! Now create your first one.',
            '', 
            'In collaborative writing projects on GitHub, issues are the central way to coordinate work and communicate with your collaborators.', 
            'For example, you might want to create an issue to remind yourself (and your collaborators) that your project doesn\'t yet have a preregistration.',
            '', 
            'In issues (as in many GitHub tools), text is formatted in Markdown. Markdown lets you write plain text while adding simple symbols to control formatting, such as **bold**, *italics*, or headings.',
            '```markdown',
            '# A heading',
            '',
            'A list:',
            '',
            '* apple',
            '* banana',
            '',
            '**bold**',
            '*italic*',
            '',
            'A todo list:',
            '',
            '- [x] done',
            '- [ ] todo',
            '',
            'For Git\'s sake, put each sentence on its own line.',
            'Please.',
            'I beg you.',
            '```',
            '',
            'You can find an overview of Markdown formatting options [here](https://media.datacamp.com/legacy/image/upload/v1697797990/Marketing/Blog/Markdown_Cheat_Sheet.pdf).',
            '',
            '**Task:** Create a new issue in your repository!',
            '- Go to the **Issues** tab.', 
            '- Click **New Issue**.', 
            '- Use this exact title: **Preregistration needed**', 
            '',
            '```',
            'Preregistration needed',
            '```',
            '',
            '- Add a brief introduction about yourself, what brings you to this workshop and what you\'re hoping to learn. Make sure to try different Markdown formatting options!', 
            '', 
            `**Afterwards:** Return to this issues and comment \`/done 4\` here: ${preregistrationUrl}`,
            '',
            `<img src="https://${context.repo.owner}.github.io/${context.repo.repo}/assets/create_issue.gif" alt="Make Issues GIF">`,
        ];
        
        const newIssue = await github.rest.issues.create({
            owner: owner,
            repo:  repo,
            title: 'Create your own first issue',
            body: issueBodyLines.join('\n')
        });
        
        // 4) Celebrate in the upstream issue with link to new issue
        const milestone3BodyLines = [
            '🎉 Milestone 3 complete - "Activate issues"!',
            '',
            `**Task:** Milestone 4 - 🟢 Easy is now available, and an issue is waiting in your fork, look into it: ${newIssue.data.html_url}`,
            '',
            `**Afterwards:** Comment \`/done 4\` here.`,
        ];
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo:  context.repo.repo,
            issue_number: context.issue.number,
            body: milestone3BodyLines.join('\n')
        });
    }
};