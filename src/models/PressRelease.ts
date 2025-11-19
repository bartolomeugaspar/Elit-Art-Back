export interface IPressRelease {
  id: string
  title: string
  content: string
  summary: string
  image_url?: string
  publication_date: Date
  author: string
  status: 'draft' | 'published' | 'archived'
  created_at: Date
  updated_at: Date
}

export interface IPressReleaseInput {
  title: string
  content: string
  summary: string
  image_url?: string
  publication_date: Date
  author: string
  status?: 'draft' | 'published' | 'archived'
}

export interface IMediaKit {
  id: string
  title: string
  description: string
  file_url: string
  file_type: 'pdf' | 'zip' | 'doc'
  file_size: number
  downloads: number
  created_at: Date
  updated_at: Date
}

export interface IMediaKitInput {
  title: string
  description: string
  file_url: string
  file_type: 'pdf' | 'zip' | 'doc'
  file_size: number
}
