import PaginationOptions from './PaginationOptions';

type PaginationInfoResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  nextPage: number;
  prevPage: number;
};

export type PaginationDataResponse<T> = {
  status: string;
  paginationInfo: PaginationInfoResponse;
  data: T[];
};

class PaginationData<T> {
  paginationOptions: PaginationOptions;
  itemCount: number;
  items: Array<T>;
  /**
   *
   * @param {PaginationOptions} paginationOptions
   * @param itemCount
   */
  constructor(paginationOptions: PaginationOptions, itemCount: number) {
    this.paginationOptions = paginationOptions;
    this.itemCount = itemCount;
    this.items = [];
  }

  setItemCount(count): void {
    this.itemCount = count;
  }

  totalPages(): number {
    return Math.ceil(this.itemCount / this.paginationOptions.limit());
  }

  addItem(item): void {
    this.items.push(item);
  }

  hasNext(): boolean {
    return this.paginationOptions.getCurrentPage() < this.totalPages();
  }

  nextPage(): number {
    return this.paginationOptions.getCurrentPage() + 1;
  }

  hasPrev(): boolean {
    return this.paginationOptions.getCurrentPage() > 1;
  }

  prevPage(): number {
    return this.paginationOptions.getCurrentPage() - 1;
  }

  getItems(): any {
    return this.items;
  }

  getItemCount(): number {
    return this.itemCount;
  }

  getPaginatedData() {
    const paginationInfo: PaginationInfoResponse = {
      totalItems: this.itemCount,
      totalPages: this.totalPages(),
      currentPage: this.paginationOptions.getCurrentPage(),
      perPage: this.paginationOptions.limit(),
      nextPage: 0,
      prevPage: 0,
    };

    if (this.hasNext()) {
      paginationInfo.nextPage = this.nextPage();
    }

    if (this.hasPrev()) {
      paginationInfo.prevPage = this.prevPage();
    }

    return {
      status: 'success',
      paginationInfo,
      data: this.items,
    };
  }
}

export default PaginationData;
