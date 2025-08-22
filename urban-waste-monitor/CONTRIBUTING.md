# Contributing to Urban Waste Monitor

We welcome contributions to the Urban Waste Monitor project! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/urban-waste-monitor.git`
3. Install dependencies: `npm install && cd server && npm install && cd ../client && npm install && cd ../simulator && npm install`
4. Set up the database: `cd server && npm run db:setup`
5. Start development: `npm run dev`

## Development Guidelines

### Code Style
- Use ESLint and Prettier for code formatting
- Follow existing code patterns and conventions
- Write meaningful commit messages
- Add comments for complex logic

### Testing
- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test accessibility features with screen readers
- Test API endpoints with various inputs

### Accessibility
- Follow WCAG 2.1 AA guidelines
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Test with screen readers

## Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and add tests
3. Run tests: `npm test`
4. Commit changes: `git commit -m "Add feature: description"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Submit a pull request

## Pull Request Guidelines

- Provide a clear description of changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure CI tests pass
- Request review from maintainers

## Reporting Issues

- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include system information
- Add relevant logs or error messages

## Feature Requests

- Open an issue with the "enhancement" label
- Describe the use case and benefits
- Discuss implementation approach
- Consider backward compatibility

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Maintain a professional environment

## License

By contributing, you agree that your contributions will be licensed under the MIT License.