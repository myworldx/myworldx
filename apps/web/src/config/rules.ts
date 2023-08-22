const __VALID_EXTENSIONS_MAP = new Map()

__VALID_EXTENSIONS_MAP.set('project', {
  valid: true,
  name: 'Project',
  description: 'User can show your projects like a portfolio',
  icon: 'project',
  color: 'blue',
  path: 'project',
  extensions: ['project'],
  extensionsKeys: ['project'],
  extensionsValues: ['project'],
  extensionsMap: new Map([['project', 'project']]),
})
__VALID_EXTENSIONS_MAP.set('index', {})
__VALID_EXTENSIONS_MAP.set('blog', {})
__VALID_EXTENSIONS_MAP.set('post', {})
__VALID_EXTENSIONS_MAP.set('post', {})

export { __VALID_EXTENSIONS_MAP }
