export function initialize(container, application) {
  application.inject('adapter', 'networkMonitorService', 'service:network-monitor');
  application.inject('controller:application', 'networkMonitorService', 'service:network-monitor');
}

export default {
  name: 'network-monitor-service',
  initialize: initialize
};
