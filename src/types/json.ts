/**
 * JSON Types
 */
export type Key = string | number;

export type Primitive = Key | Boolean | null | undefined;

export type Json<T> = Primitive & Compound<T>;

export type Compound<T> = List<T> & Dict<T>;

// using "Dict" to distinguish between
// Object as a collection and Object as other
export interface Dict<T> {
  [key: string]: Json<T>;
}

// using "List" for similar reasons
// The idea is not to confuse OQ
// with Array/Object.
export interface List<T> {
  [index: number]: Json<T>;
  length: number;
}
