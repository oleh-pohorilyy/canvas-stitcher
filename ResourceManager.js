class ResourceManager {

  _resources = {}
  _handlers = []

  constructor() {}

  get(name) {
    return this._resources[name]
  }

  getAll() {
    return Object.values(this._resources)
  }

  add(name, resource) {
    this._resources[name] = resource

    this._handlers.forEach(handler => handler(this.getAll(), resource))
  }

  subscribe(handler) {
    this._handlers.push(handler)
  }

  unsubscribe(handler) {
    this._handlers = this._handlers.filter(h => h !== handler)
  }

}