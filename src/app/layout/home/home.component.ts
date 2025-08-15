import { Component, OnInit } from '@angular/core';
import { fadeInAnimation, slideUpAnimation } from '../../shared/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInAnimation, slideUpAnimation]
})
export class HomeComponent implements OnInit {

  features = [
    {
      title: 'Secure Shopping',
      description: 'Shop with confidence using our robust security measures and encrypted transactions.',
      icon: '🔒'
    },
    {
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly with our efficient logistics network.',
      icon: '🚚'
    },
    {
      title: 'Quality Products',
      description: 'Discover high-quality products from trusted sellers and brands.',
      icon: '⭐'
    },
    {
      title: '24/7 Support',
      description: 'Our customer support team is available around the clock to help you.',
      icon: '💬'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
