import { SectionCollection } from "@/types/collections"

export const urlToCollection: Record<string, SectionCollection> = {
    'customer-orders': 'customerOrders',
    'shop-orders': 'shopOrders',
    'parts': 'parts',
    'serials': 'serials',
    'customers': 'customers',
}

export const collectionToName: Record<SectionCollection, string> = {
    customerOrders: 'Customer Orders',
    shopOrders: 'Shop Orders',
    parts: 'Parts',
    serials: 'Serials',
    customers: 'Customers',
}

export const collectionToUrl: Record<SectionCollection, string> = {
    customerOrders: 'customer-orders',
    shopOrders: 'shop-orders',
    parts: 'parts',
    serials: 'serials',
    customers: 'customers',
}

export const nameToCollection: Record<string, SectionCollection> = {
    'Customer Orders': 'customerOrders',
    'Shop Orders': 'shopOrders',
    'Parts': 'parts',
    'Serials': 'serials',
    'Customers': 'customers',
}