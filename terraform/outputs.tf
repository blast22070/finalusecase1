output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "The name of the resource group containing the AKS cluster."
}

output "kubernetes_cluster_name" {
  value       = azurerm_kubernetes_cluster.aks.name
  description = "The name of the AKS cluster."
}

output "kube_config" {
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
  description = "Raw Kubernetes kubeconfig representation."
}

output "connect_command" {
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.rg.name} --name ${azurerm_kubernetes_cluster.aks.name}"
  description = "Command helper to configure kubectl connectivity."
}
