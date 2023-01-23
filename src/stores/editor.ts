import type RecipeEditor from 'src/lib/RecipeEditor';
import { writable } from 'svelte/store';

export const editor = writable<RecipeEditor>();