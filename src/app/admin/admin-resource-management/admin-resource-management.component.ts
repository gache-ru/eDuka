import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';
import { ProductService } from 'src/app/services/product.service';
import { NotificationService } from 'src/app/services/notification.service';
import { fadeInAnimation, slideUpAnimation, staggerAnimation } from '../../shared/animations';

interface ResourceItem extends Product {
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  lastUpdated: Date;
}

@Component({
  selector: 'app-admin-resource-management',
  templateUrl: './admin-resource-management.component.html',
  styleUrls: ['./admin-resource-management.component.scss'],
  animations: [fadeInAnimation, slideUpAnimation, staggerAnimation]
})
export class AdminResourceManagementComponent implements OnInit, OnDestroy {

  resources$: Observable<ResourceItem[]> = of([]);
  loading = false;
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  private destroy$ = new Subject<void>();

  // Mock data for demonstration
  mockResources: ResourceItem[] = [
    {
      key: '1',
      title: 'Wireless Headphones',
      price: 99.99,
      category: { name: 'Electronics' },
      imageUrl: 'https://via.placeholder.com/150',
      stock: 25,
      lowStockThreshold: 10,
      isLowStock: false,
      lastUpdated: new Date()
    },
    {
      key: '2',
      title: 'Gaming Mouse',
      price: 49.99,
      category: { name: 'Electronics' },
      imageUrl: 'https://via.placeholder.com/150',
      stock: 5,
      lowStockThreshold: 10,
      isLowStock: true,
      lastUpdated: new Date()
    },
    {
      key: '3',
      title: 'Coffee Mug',
      price: 12.99,
      category: { name: 'Home & Kitchen' },
      imageUrl: 'https://via.placeholder.com/150',
      stock: 50,
      lowStockThreshold: 15,
      isLowStock: false,
      lastUpdated: new Date()
    },
    {
      key: '4',
      title: 'Notebook Set',
      price: 19.99,
      category: { name: 'Office Supplies' },
      imageUrl: 'https://via.placeholder.com/150',
      stock: 8,
      lowStockThreshold: 12,
      isLowStock: true,
      lastUpdated: new Date()
    }
  ];

  categories = [
    { name: 'All Categories', value: '' },
    { name: 'Electronics', value: 'electronics' },
    { name: 'Home & Kitchen', value: 'home' },
    { name: 'Office Supplies', value: 'office' }
  ];

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadResources(): void {
    this.loading = true;
    
    setTimeout(() => {
      this.resources$ = of(this.mockResources.map(resource => ({
        ...resource,
        isLowStock: resource.stock <= resource.lowStockThreshold
      })));
      this.loading = false;
    }, 1000);
  }

  updateStock(resourceKey: string, newStock: number): void {
    if (newStock < 0) {
      this.notificationService.showError('Stock cannot be negative');
      return;
    }

    const resourceIndex = this.mockResources.findIndex(r => r.key === resourceKey);
    if (resourceIndex !== -1) {
      this.mockResources[resourceIndex].stock = newStock;
      this.mockResources[resourceIndex].lastUpdated = new Date();
      this.mockResources[resourceIndex].isLowStock = newStock <= this.mockResources[resourceIndex].lowStockThreshold;
      
      this.loadResources();
      this.notificationService.showSuccess(`Stock updated for ${this.mockResources[resourceIndex].title}`);
    }
  }

  updateLowStockThreshold(resourceKey: string, threshold: number): void {
    if (threshold < 0) {
      this.notificationService.showError('Threshold cannot be negative');
      return;
    }

    const resourceIndex = this.mockResources.findIndex(r => r.key === resourceKey);
    if (resourceIndex !== -1) {
      this.mockResources[resourceIndex].lowStockThreshold = threshold;
      this.mockResources[resourceIndex].isLowStock = this.mockResources[resourceIndex].stock <= threshold;
      this.mockResources[resourceIndex].lastUpdated = new Date();
      
      this.loadResources();
      this.notificationService.showSuccess(`Low stock threshold updated for ${this.mockResources[resourceIndex].title}`);
    }
  }

  getFilteredResources(): Observable<ResourceItem[]> {
    return new Observable(observer => {
      this.resources$.subscribe(resources => {
        let filtered = resources;

        if (this.searchTerm) {
          filtered = filtered.filter(resource =>
            resource.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            resource.category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }

        if (this.selectedCategory) {
          filtered = filtered.filter(resource => 
            resource.category.name.toLowerCase().includes(this.selectedCategory.toLowerCase())
          );
        }

        filtered.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (this.sortBy) {
            case 'name':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            case 'stock':
              aValue = a.stock;
              bValue = b.stock;
              break;
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'category':
              aValue = a.category.name.toLowerCase();
              bValue = b.category.name.toLowerCase();
              break;
            default:
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
          }

          if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });

        observer.next(filtered);
      });
    });
  }

  toggleSort(field: string): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
  }

  getLowStockCount(): number {
    return this.mockResources.filter(resource => resource.isLowStock).length;
  }

  getTotalValue(): number {
    return this.mockResources.reduce((total, resource) => total + (resource.price * resource.stock), 0);
  }

  exportData(): void {
    this.notificationService.showInfo('Export functionality would be implemented here');
  }

  refreshData(): void {
    this.loadResources();
    this.notificationService.showSuccess('Resource data refreshed');
  }

  onStockChange(event: Event, resourceKey: string): void {
    const target = event.target as HTMLInputElement;
    const newStock = +target.value;
    this.updateStock(resourceKey, newStock);
  }

  onThresholdChange(event: Event, resourceKey: string): void {
    const target = event.target as HTMLInputElement;
    const newThreshold = +target.value;
    this.updateLowStockThreshold(resourceKey, newThreshold);
  }
}
