import { Categories, Category } from '@/types'; // ajusta la ruta según tu proyecto

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.FRONT_URL}/api/categories`);
  if (!res.ok) throw new Error('Error al obtener categorías');

  const json: Categories = await res.json();
  return json.data;
}
