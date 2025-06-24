class PaginationOptions {
  currentPage: number;
  perPage: number;

  constructor(currentPage: number = 1, perPage: number = 10) {
    this.currentPage = Number(currentPage);
    this.perPage = Number(perPage);
  }

  limit(): number {
    return this.perPage;
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  offset(): number {
    return (this.currentPage - 1) * this.limit();
  }
}

export default PaginationOptions;
