import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  console.log('Creating admin user...')
  const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'Admin@123')
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create categories
  console.log('Creating categories...')
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronics and gadgets',
      icon: '📱',
      sortOrder: 1,
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy fashion and clothing',
      icon: '👕',
      sortOrder: 2,
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home improvement and garden supplies',
      icon: '🏠',
      sortOrder: 3,
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'Sports equipment and accessories',
      icon: '⚽',
      sortOrder: 4,
    },
    {
      name: 'Books',
      slug: 'books',
      description: 'Books and reading materials',
      icon: '📚',
      sortOrder: 5,
    },
    {
      name: 'Beauty',
      slug: 'beauty',
      description: 'Beauty and personal care products',
      icon: '💄',
      sortOrder: 6,
    },
  ]

  const createdCategories = []
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    })
    createdCategories.push(category)
    console.log(`✅ Category created: ${category.name}`)
  }

  // Create sample products
  console.log('Creating sample products...')
  
  const products = [
    {
      name: 'Wireless Headphones Pro',
      slug: 'wireless-headphones-pro',
      description: 'Premium wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals.',
      shortDescription: 'Premium wireless headphones with noise cancellation',
      categoryId: createdCategories[0].id, // Electronics
      brand: 'AudioTech',
      sku: 'AUD-001',
      price: 99.99,
      comparePrice: 149.99,
      stockQuantity: 50,
      isFeatured: true,
      tags: ['wireless', 'headphones', 'audio'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
          alt: 'Wireless Headphones Pro',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      name: 'Smart Watch Pro',
      slug: 'smart-watch-pro',
      description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and smartphone connectivity. Stay connected on the go.',
      shortDescription: 'Advanced smartwatch with fitness tracking',
      categoryId: createdCategories[0].id, // Electronics
      brand: 'TechWear',
      sku: 'TECH-002',
      price: 249.99,
      comparePrice: 299.99,
      stockQuantity: 30,
      isFeatured: true,
      tags: ['smartwatch', 'fitness', 'wearable'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
          alt: 'Smart Watch Pro',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'High-quality yoga mat with non-slip surface and extra cushioning. Perfect for yoga, pilates, and fitness routines.',
      shortDescription: 'High-quality yoga mat with non-slip surface',
      categoryId: createdCategories[3].id, // Sports
      brand: 'FitLife',
      sku: 'FIT-003',
      price: 34.99,
      comparePrice: 44.99,
      stockQuantity: 75,
      isFeatured: true,
      tags: ['yoga', 'fitness', 'exercise'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop',
          alt: 'Yoga Mat Premium',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
  ]

  for (const productData of products) {
    const { images, ...productInfo } = productData
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        images: {
          create: images,
        },
      },
    })
    console.log(`✅ Product created: ${product.name}`)
  }

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

