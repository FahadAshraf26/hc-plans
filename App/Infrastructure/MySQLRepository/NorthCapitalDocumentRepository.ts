import { INorthCapitalDocumentRepository } from "@domain/Core/NorthCapitalDocument/INorthCapitalDocumentRepository";
import BaseRepository from "./BaseRepository";
import models from "@infrastructure/Model";
import NorthCapitalDocument from "@domain/Core/NorthCapitalDocument/NorthCapitalDocument";
import { injectable } from "inversify";

const { NorthCapitalDocumentModel } = models;

@injectable()
class NorthCapitalDocumentRepository extends BaseRepository implements INorthCapitalDocumentRepository {
  constructor() {
    super(NorthCapitalDocumentModel,'ncDocumentId',NorthCapitalDocument);
  }
}

export default NorthCapitalDocumentRepository;
