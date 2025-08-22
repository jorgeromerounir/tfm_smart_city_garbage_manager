# Contributing Guide

## Welcome Contributors!

Thank you for your interest in contributing to the Urban Waste Monitoring System. This guide will help you get started.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies in all modules:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../sensor-simulator && npm install
   ```
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Code Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for public APIs

### React Components
- Use functional components with hooks
- Follow Material-UI design patterns
- Implement proper error boundaries
- Add accessibility attributes

### Backend Services
- Use NestJS decorators and modules
- Implement proper validation with class-validator
- Add error handling and logging
- Write unit tests for services

## Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:cov  # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
Test the complete workflow:
1. Start backend
2. Start frontend
3. Start sensor simulator
4. Verify data flow and UI updates

## Pull Request Process

1. **Before submitting:**
   - Run all tests
   - Check code formatting
   - Update documentation if needed
   - Test in both supported cities

2. **PR Description:**
   - Clear title describing the change
   - Detailed description of what was changed
   - Screenshots for UI changes
   - Link to related issues

3. **Review Process:**
   - Code review by maintainers
   - Automated tests must pass
   - Documentation updates reviewed

## Feature Requests

### High Priority Features
- Additional city support
- Advanced route algorithms
- Mobile app integration
- Real-time analytics dashboard

### Implementation Guidelines
- Follow existing architecture patterns
- Maintain backward compatibility
- Add comprehensive tests
- Update documentation

## Bug Reports

### Required Information
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version)
- Console logs/error messages
- Screenshots if applicable

### Bug Fix Process
1. Create issue with bug template
2. Reproduce the bug locally
3. Write failing test case
4. Implement fix
5. Verify test passes
6. Submit PR with fix

## Architecture Guidelines

### Backend (NestJS)
```
src/
├── containers/     # Container management
├── routes/         # Route optimization
├── websocket/      # Real-time updates
└── database/       # Data models
```

### Frontend (React)
```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level components
├── services/       # API and WebSocket
└── types/          # TypeScript interfaces
```

### Adding New Features

#### New API Endpoint
1. Create DTO in appropriate module
2. Add service method with business logic
3. Create controller endpoint
4. Add validation and error handling
5. Update API documentation

#### New UI Component
1. Create component in `components/`
2. Follow Material-UI patterns
3. Add TypeScript interfaces
4. Implement accessibility
5. Add to Storybook (if available)

## Performance Guidelines

### Backend
- Use database indexes for queries
- Implement caching for frequent requests
- Optimize WebSocket event frequency
- Monitor memory usage

### Frontend
- Lazy load components
- Optimize map rendering
- Debounce user inputs
- Use React.memo for expensive components

## Security Considerations

### Data Validation
- Validate all inputs server-side
- Sanitize user data
- Use parameterized queries
- Implement rate limiting

### Authentication (Future)
- JWT token implementation
- Role-based access control
- Secure WebSocket connections
- API key management

## Documentation

### Code Documentation
- JSDoc for all public methods
- README updates for new features
- API documentation updates
- Architecture decision records

### User Documentation
- Setup instructions
- Feature usage guides
- Troubleshooting guides
- Video tutorials (future)

## Community

### Communication
- GitHub Issues for bugs/features
- Discussions for questions
- Wiki for detailed documentation

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers
- Follow project guidelines

## Release Process

### Version Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog maintenance
- Migration guides for breaking changes

### Deployment
- Automated testing pipeline
- Staging environment validation
- Production deployment checklist
- Rollback procedures

Thank you for contributing to making urban waste management more efficient! 🌱