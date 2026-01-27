import type { Category, Author, Book } from '@/types';
import { faker } from '@faker-js/faker';

faker.seed(12345);

const slugify = (s: string) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Mock Category
export const mockCategories: Category[] = Array.from({ length: 20 }).map((_, idx) => {
  const i = idx + 1;
  const enName = faker.commerce.department();
  const viName = 'Danh mục ' + enName;
  const slug = `${slugify(enName)}`;

  return {
    id: i.toString(),
    slug,
    parentId: i > 1 ? '1' : undefined,
    translations: [
      {
        lang: 'en',
        name: enName,
        description: faker.lorem.sentences(2),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
      {
        lang: 'vi',
        name: viName,
        description: faker.lorem.sentences(2),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    ],
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent(),
  } as Category;
});

export const mockAuthors: Author[] = Array.from({ length: 20 }).map((_, idx) => {
  const i = idx + 1;
  return {
    id: i.toString(),
    name: faker.person.fullName(),
    avatarUrl: `https://placehold.co/80x80?text=Author+${i}`,
    birthDate: faker.date.birthdate({ min: 1940, max: 1995, mode: 'year' }),
    nationality: faker.location.country(),
    bio: faker.lorem.paragraph(),
    createdAt: faker.date.past({ years: 3 }),
    updatedAt: faker.date.recent(),
  } as Author;
});

export const mockBooks: Book[] = Array.from({ length: 100 }).map((_, idx) => {
  const i = idx + 1;
  const selectedAuthors = faker.helpers.arrayElements(
    mockAuthors,
    faker.number.int({ min: 1, max: 2 })
  );
  const selectedCategories = faker.helpers.arrayElements(
    mockCategories,
    faker.number.int({ min: 2, max: 4 })
  );

  return {
    id: i.toString(),
    title: faker.lorem.sentence({ min: 2, max: 6 }),
    subtitle: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.lorem.paragraphs(2),
    publisher: faker.company.name(),
    publishedDate: faker.date.past({ years: 10 }),
    edition: `${faker.number.int({ min: 1, max: 5 })}th`,
    isbn: `978-${faker.string.numeric(10)}`,
    language: faker.helpers.arrayElement(['gb', 'vn', 'fr', 'cn', 'es']),
    pages: faker.number.int({ min: 100, max: 900 }),
    price: faker.number.int({ min: 5, max: 200 }),
    stock: faker.number.int({ min: 0, max: 200 }),
    coverUrl: `https://placehold.co/80x120?text=Book+${i}`,
    fileUrl: `https://example.com/ebook${i}.pdf`,
    tags: faker.helpers.arrayElements(
      ['sample', 'mock', 'fiction', 'non-fiction', 'programming', 'design'],
      faker.number.int({ min: 1, max: 3 })
    ),
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent(),
    updatedBy: 'admin',
    authors: selectedAuthors,
    categories: selectedCategories,
  } as Book;
});
