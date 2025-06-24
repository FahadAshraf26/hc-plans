import BaseEntity from '../BaseEntity/BaseEntity';
import uuid from 'uuid/v4';

class Loanwell extends BaseEntity {
  private readonly loanwellId: string;
  private readonly name: string;
  private readonly importedBy: string;

  constructor({ loanwellId, name, importedBy }) {
    super();
    this.loanwellId = loanwellId;
    this.name = name;
    this.importedBy = importedBy;
  }

  static createFromObject(props) {
    const loanwell = new Loanwell(props);

    if (props.createdAt) {
      loanwell.setCreatedAt(props.createdAt);
    }

    if (props.updatedAt) {
      loanwell.setUpdatedAt(props.updatedAt);
    }

    if (props.deletedAt) {
      loanwell.setDeletedAT(props.deletedAt);
    }

    return loanwell;
  }

  static createFromDetail(props) {
    return new Loanwell({ loanwellId: uuid(), ...props });
  }
}

export default Loanwell;
