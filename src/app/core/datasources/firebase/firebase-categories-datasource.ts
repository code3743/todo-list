import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { FIRESTORE_COLLECTIONS } from '../../constants/app.constants';
import { Category } from '../../models/category';
import { Firebase } from '../../services/firebase';
import { CategoriesDataSource } from '../categories-datasource';

const COL = FIRESTORE_COLLECTIONS.CATEGORIES;

@Injectable()
export class FirebaseCategoriesDataSource implements CategoriesDataSource {
  private readonly db = getFirestore(this.firebase.app);

  constructor(private readonly firebase: Firebase) {}

  async getAll(): Promise<Category[]> {
    const snap = await getDocs(collection(this.db, COL));
    return snap.docs.map(d => d.data() as Category);
  }

  async add(category: Category): Promise<void> {
    await setDoc(doc(this.db, COL, category.id), category);
  }

  async update(id: string, changes: Partial<Category>): Promise<void> {
    await updateDoc(doc(this.db, COL, id), changes as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COL, id));
  }
}
