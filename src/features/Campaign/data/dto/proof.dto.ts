export interface ProofDto {
  id: string
  campaignId: string
  userId: string
  title: string
  content: string
  createdAt: string
  campaign?: any
  user?: any
}

export interface CreateProofRequestDto {
  title: string
  content: string
  userAddress: string
}

export interface CreateProofResponseDto {
  proof: ProofDto
}
