variable "resource_group_name" {
  type        = string
  default     = "talentflow-ems-rg"
  description = "Name of the Azure Resource Group to create."
}

variable "location" {
  type        = string
  default     = "East US"
  description = "Azure region where resources will be deployed."
}

variable "cluster_name" {
  type        = string
  default     = "talentflow-aks-cluster"
  description = "Name of the Azure Kubernetes Service (AKS) cluster."
}

variable "dns_prefix" {
  type        = string
  default     = "talentflowaks"
  description = "DNS prefix specified when creating the managed cluster."
}

variable "node_count" {
  type        = number
  default     = 2
  description = "The number of worker nodes in the default node pool."
}

variable "node_size" {
  type        = string
  default     = "Standard_D2s_v3"
  description = "The size of the Virtual Machines to use for the worker nodes."
}
