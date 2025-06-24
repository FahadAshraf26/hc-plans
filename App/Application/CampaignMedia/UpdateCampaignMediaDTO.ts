class UpdateCampaignMediaDTO{
  private files: any
  constructor(files) {
    this.files = files;    
  }

  getFiles() {
   return this.files
 }
}

export default UpdateCampaignMediaDTO;