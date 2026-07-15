/**
 * commitlint configuration
 * @see https://commitlint.js.org/reference/configuration.html
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed conventional-commit types. Match package.json script names where sensible.
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'build',
        'revert',
      ],
    ],
    // Subjects longer than 100 chars get cut off in GitHub UI.
    'subject-max-length': [2, 'always', 100],
  },
}
