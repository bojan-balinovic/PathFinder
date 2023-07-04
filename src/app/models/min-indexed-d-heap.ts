class MinIndexedDHeap<T> {
  private heap: [number, T][];
  private indexMap: Map<number, number>;
  private d: number;

  constructor(d: number) {
    if (d < 2) {
      throw new Error('d must be greater than or equal to 2');
    }
    this.heap = [];
    this.indexMap = new Map();
    this.d = d;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / this.d);
  }

  private getChildIndices(index: number): number[] {
    const childIndices: number[] = [];
    for (let i = 1; i <= this.d; i++) {
      const childIndex = this.d * index + i;
      if (childIndex < this.heap.length) {
        childIndices.push(childIndex);
      }
    }
    return childIndices;
  }

  private hasParent(index: number): boolean {
    return this.getParentIndex(index) >= 0;
  }

  private hasChild(index: number): boolean {
    return this.d * index + 1 < this.heap.length;
  }

  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
    this.indexMap.set(this.heap[index1][0], index1);
    this.indexMap.set(this.heap[index2][0], index2);
  }

  public poll(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    const minValue = this.heap[0][1];
    this.remove(this.heap[0][0]);
    return minValue;
  }

  public decrease(index: number, newValue: T): void {
    const heapIndex = this.indexMap.get(index);
    if (heapIndex === undefined) {
      throw new Error('Index not found: ' + index);
    }

    if (newValue > this.heap[heapIndex][1]) {
      throw new Error('New value is greater than current value');
    }

    this.heap[heapIndex][1] = newValue;
    this.heapifyUp(heapIndex);
  }

  private heapifyUp(index: number): void {
    while (
      this.hasParent(index) &&
      this.heap[index][1] < this.heap[this.getParentIndex(index)][1]
    ) {
      const parentIndex = this.getParentIndex(index);
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private heapifyDown(index: number): void {
    while (this.hasChild(index)) {
      const childIndices = this.getChildIndices(index);
      const smallestChildIndex = childIndices.reduce(
        (minIndex, currentIndex) => {
          return this.heap[currentIndex][1] < this.heap[minIndex][1]
            ? currentIndex
            : minIndex;
        },
        childIndices[0]
      );

      if (this.heap[index][1] < this.heap[smallestChildIndex][1]) {
        break;
      } else {
        this.swap(index, smallestChildIndex);
      }

      index = smallestChildIndex;
    }
  }

  public insert(index: number, value: T): void {
    if (this.indexMap.has(index)) {
      throw new Error('Duplicate index: ' + index);
    }

    this.heap.push([index, value]);
    this.indexMap.set(index, this.heap.length - 1);
    this.heapifyUp(this.heap.length - 1);
  }

  public update(index: number, value: T): void {
    const heapIndex = this.indexMap.get(index);
    if (heapIndex === undefined) {
      throw new Error('Index not found: ' + index);
    }

    this.heap[heapIndex][1] = value;
    this.heapifyUp(heapIndex);
    this.heapifyDown(heapIndex);
  }

  public remove(index: number): T | undefined {
    const heapIndex = this.indexMap.get(index);
    if (heapIndex === undefined) {
      return undefined;
    }

    const value = this.heap[heapIndex][1];
    this.swap(heapIndex, this.heap.length - 1);
    this.heap.pop();
    this.indexMap.delete(index);

    this.heapifyUp(heapIndex);
    this.heapifyDown(heapIndex);

    return value;
  }

  public peekMin(): T | undefined {
    return this.heap.length > 0 ? this.heap[0][1] : undefined;
  }

  public contains(index: number): boolean {
    return this.indexMap.has(index);
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }
}
