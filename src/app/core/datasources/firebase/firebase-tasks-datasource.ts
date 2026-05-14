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
import { Task } from '../../models/task';
import { Firebase } from '../../services/firebase';
import { TasksDataSource } from '../tasks-datasource';

const COL = FIRESTORE_COLLECTIONS.TASKS;

@Injectable()
export class FirebaseTasksDataSource implements TasksDataSource {
  private readonly db = getFirestore(this.firebase.app);

  constructor(private readonly firebase: Firebase) {}

  async getAll(): Promise<Task[]> {
    const snap = await getDocs(collection(this.db, COL));
    return snap.docs.map(d => d.data() as Task);
  }

  async add(task: Task): Promise<void> {
    await setDoc(doc(this.db, COL, task.id), task);
  }

  async update(id: string, changes: Partial<Task>): Promise<void> {
    await updateDoc(doc(this.db, COL, id), changes as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.db, COL, id));
  }
}
