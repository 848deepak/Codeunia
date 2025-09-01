"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, FileText, Search, MoreHorizontal, Edit, Star, Trash2, PlusCircle, Loader2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { categories, BlogPost } from "@/components/data/blog-posts"

// types
interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string;
  featured: boolean;
  image: string;
  views?: string; // Optional since it's managed by the views API
  likes?: number; // Optional since it's calculated from blog_likes table
}

interface ApiError {
  message: string;
  details?: string;
}

// utilities
const parseTags = (tags: string | string[]): string[] => {
  if (Array.isArray(tags)) return tags
  if (typeof tags === "string" && tags.trim()) {
    return tags.split(",").map((t) => t.trim()).filter(Boolean)
  }
  return []
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getEmptyPost = (): BlogFormData => ({
  title: "",
  excerpt: "",
  content: "",
  author: "",
  date: new Date().toISOString().slice(0, 10),
  readTime: "5 min",
  category: categories[1] || "Frontend",
  tags: "",
  featured: false,
  image: "",
  // views and likes are managed automatically
})

// custom hooks
const useSupabase = () => {
  const supabase = useMemo(() => createClient(), [])
  return supabase
}

const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const supabase = useSupabase()

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // First, fetch all blog posts
      const { data: postsData, error: fetchError } = await supabase
        .from("blogs")
        .select("*")
        .order("date", { ascending: false })
      
      if (fetchError) {
        throw new Error(fetchError.message)
      }
      
      if (postsData) {
        // Fetch real like counts and ensure views are up-to-date for each blog post
        const postsWithRealCounts = await Promise.all(
          postsData.map(async (post) => {
            // Get the real like count from blog_likes table
            const { count: likeCount, error: likeError } = await supabase
              .from('blog_likes')
              .select('*', { count: 'exact', head: true })
              .eq('blog_slug', post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))
            
            if (likeError) {
              console.error('Error fetching likes for post:', post.title, likeError)
            }
            
            // Get the most up-to-date view count from blogs table
            const { data: viewData, error: viewError } = await supabase
              .from('blogs')
              .select('views')
              .eq('id', post.id)
              .single()
            
            if (viewError) {
              console.error('Error fetching views for post:', post.title, viewError)
            }
            
            return { 
              ...post, 
              likes: likeCount || 0,
              views: viewData?.views?.toString() || post.views || '0'
            }
          })
        )
        
        setBlogPosts(postsWithRealCounts as BlogPost[])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch blog posts"
      setError({ message: errorMessage })
      setBlogPosts([])
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return { blogPosts, isLoading, error, refetch: fetchPosts }
}

// components
const CategoryBadge = ({ category }: { category: string }) => (
  <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs">
    {category}
  </Badge>
)

const FeaturedBadge = ({ featured }: { featured: boolean }) => (
  featured ? (
    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs flex items-center gap-1">
      <Star className="h-3 w-3" />
      Featured
    </Badge>
  ) : (
    <Badge variant="outline" className="text-xs">
      Regular
    </Badge>
  )
)

const BlogPostForm = ({ 
  formData, 
  onFormChange
}: {
  formData: BlogFormData;
  onFormChange: (data: Partial<BlogFormData>) => void;
}) => {
  const handleInputChange = (field: keyof BlogFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onFormChange({ [field]: e.target.value })
  }

  const handleSelectChange = (field: keyof BlogFormData) => (value: string) => {
    onFormChange({ [field]: value })
  }

  const handleCheckboxChange = (checked: boolean) => {
    onFormChange({ featured: checked })
  }

  // ref for the content textarea
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Article image upload handler (for main blog image)
  const handleArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = createClient();
    const filePath = `public/${Date.now()}-article-${file.name}`;

    // upload to supabase storage
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (error) {
      alert("Article image upload failed: " + error.message);
      return;
    }

    // Get public url
    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      onFormChange({ image: publicUrlData.publicUrl });
    }
  }

  // image upload handler for inserting into content
  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = createClient();
    const filePath = `public/${Date.now()}-${file.name}`;

    // upload to supabase storage
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (error) {
      alert("Image upload failed: " + error.message);
      return;
    }

    // Get public url
    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      // insert html <img> tag at cursor in content
      if (contentRef.current) {
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = formData.content.slice(0, start);
        const after = formData.content.slice(end);
        const htmlImg = `<img src="${publicUrlData.publicUrl}" alt="Alt text" style="max-width:100%;height:auto;" />\n`;
        const newContent = before + htmlImg + after;
        onFormChange({ content: newContent });
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + htmlImg.length;
        }, 0);
      }
    }
  }

  return (
    <div className="grid gap-4 py-4">
      {/* Article Image upload section */}
      <div className="grid gap-2">
        <Label htmlFor="article-image">Article Image</Label>
        <Input
          id="article-image"
          type="file"
          accept="image/*"
          onChange={handleArticleImageUpload}
          className="text-sm"
        />
        {formData.image && (
          <div>
            <img src={formData.image} alt="Article Preview" className="mt-2 max-h-32" />
            <div className="mt-2 flex items-center gap-2">
              <Input value={formData.image} readOnly className="text-xs" />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Enter post title"
          value={formData.title}
          onChange={handleInputChange('title')}
          className="text-sm"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="excerpt">Excerpt *</Label>
        <Input
          id="excerpt"
          placeholder="Brief description of the post"
          value={formData.excerpt}
          onChange={handleInputChange('excerpt')}
          className="text-sm"
        />
      </div>

      {/* Content image upload button */}
      <div className="grid gap-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          ref={contentRef}
          placeholder="Write your blog post content here..."
          value={formData.content}
          onChange={handleInputChange('content')}
          className="text-sm min-h-[120px]"
        />
        <Input
          id="content-image"
          type="file"
          accept="image/*"
          onChange={handleContentImageUpload}
          className="text-sm mt-2"
        />
        <span className="text-xs text-muted-foreground">Upload and insert image at cursor in content</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            placeholder="Author name"
            value={formData.author}
            onChange={handleInputChange('author')}
            className="text-sm"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="readTime">Read Time</Label>
          <Input
            id="readTime"
            placeholder="e.g., 5 min"
            value={formData.readTime}
            onChange={handleInputChange('readTime')}
            className="text-sm"
          />
        </div>
      </div>

      {/* Views are managed automatically by the views API */}

      <div className="grid gap-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Enter tags separated by commas"
          value={formData.tags}
          onChange={handleInputChange('tags')}
          className="text-sm"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.category} 
          onValueChange={handleSelectChange('category')}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.slice(1).map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="featured" className="text-sm font-medium">
          Mark as featured post
        </Label>
      </div>
    </div>
  )
}

const ErrorAlert = ({ error, onRetry }: { error: ApiError; onRetry: () => void }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="flex items-center justify-between">
      <span>{error.message}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="ml-4"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </AlertDescription>
  </Alert>
)

const EmptyState = ({ title, description, action }: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm mb-4">{description}</p>
    {action}
  </div>
)

// main component
export default function AdminBlogPage() {
  const { blogPosts, isLoading, error, refetch } = useBlogPosts()
  const supabase = useSupabase()
  

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<BlogPost | null>(null)
  const [showDelete, setShowDelete] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState<BlogFormData>(getEmptyPost())
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)


  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch = [
        post.title,
        post.excerpt,
        post.author,
        ...parseTags(post.tags)
      ].some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      const matchesCategory = categoryFilter === "All" || post.category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
  }, [blogPosts, searchTerm, categoryFilter])

  // form handlers
  const handleFormChange = useCallback((data: Partial<BlogFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
    setFormError(null)
  }, [])

  const validateForm = (data: BlogFormData): string | null => {
    if (!data.title.trim()) return "Title is required"
    if (!data.excerpt.trim()) return "Excerpt is required"
    if (!data.content.trim()) return "Content is required"
    if (!data.author.trim()) return "Author is required"
    return null
  }

  const resetForm = useCallback(() => {
    setFormData(getEmptyPost())
    setFormError(null)
  }, [])

  // crud ops
  const handleCreate = async () => {
    const validationError = validateForm(formData)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormLoading(true)
    setFormError(null)

    try {
      // Prepare insert data with proper types
      const insertData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
        date: formData.date,
        readTime: formData.readTime.trim(),
        category: formData.category,
        tags: parseTags(formData.tags),
        featured: Boolean(formData.featured),
        image: formData.image.trim(),
        // Generate slug from title if needed
        slug: formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      }

      const { error, data } = await supabase
        .from("blogs")
        .insert([insertData])
        .select()

      if (error) {
        throw error
      }

      setShowCreate(false)
      resetForm()
      await refetch()
    } catch (err) {
      console.error('Create error:', err)
      const errorMessage = err instanceof Error ? err.message : "Failed to create post"
      setFormError(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!showEdit) return

    const validationError = validateForm(formData)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormLoading(true)
    setFormError(null)

    try {
      // prepare update data, ensuring proper types and excluding id
      const updateData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
        date: formData.date,
        readTime: formData.readTime.trim(),
        category: formData.category,
        tags: parseTags(formData.tags),
        featured: Boolean(formData.featured),
        image: formData.image.trim(),
      }

      const { error, data } = await supabase
        .from("blogs")
        .update(updateData)
        .eq("id", showEdit.id)
        .select()

      if (error) {
        throw error
      }

      setShowEdit(null)
      resetForm()
      await refetch()
    } catch (err) {
      console.error('Update error:', err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update post"
      setFormError(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!showDelete) return

    setFormLoading(true)
    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", showDelete.id)

      if (error) throw error

      setShowDelete(null)
      await refetch()
    } catch (err) {
      console.error("Delete error:", err)
    } finally {
      setFormLoading(false)
    }
  }

  // dialog handlers
  const openCreate = () => {
    setShowCreate(true)
    resetForm()
  }

  const openEdit = (post: BlogPost) => {
    setShowEdit(post)
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || "")
    })
    setFormError(null)
  }

  const closeCreate = () => {
    setShowCreate(false)
    resetForm()
  }

  const closeEdit = () => {
    setShowEdit(null)
    resetForm()
  }

  return (
    <div className="space-y-8 md:space-y-14 min-h-screen px-4 py-8 md:px-8 lg:px-16 relative overflow-x-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60 select-none" aria-hidden>
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <radialGradient id="bgPattern" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.04" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgPattern)" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-zinc-800/60 relative z-10 mt-2 mb-4">
        <span className="inline-block w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-400 to-pink-400 rounded-full mr-2" />
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm flex items-center gap-3">
            Blog Management
          </h1>
          <p className="text-zinc-400 mt-1 font-medium text-sm sm:text-base">
            Manage and monitor all blog posts
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-3">
          <Button variant="outline" className="text-sm" onClick={openCreate}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
          <Button variant="outline" className="text-sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredPosts.length} of {blogPosts.length} posts
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-3 mt-8 md:mt-10 mb-2 relative z-10">
        <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Blog Posts
        </h2>
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-2xl rounded-2xl bg-gradient-to-br from-purple-100/80 to-pink-200/60 dark:from-purple-900/60 dark:to-pink-800/40 relative overflow-hidden group">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-zinc-900 dark:text-zinc-100 font-bold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-400" />
            Blog Posts
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-300 font-medium text-sm">
            Search and filter through all blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Error Alert */}
          {error && <ErrorAlert error={error} onRetry={refetch} />}

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blog posts by title, excerpt, author, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40 text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-purple-400" />
            </div>
          ) : error ? (
            <EmptyState
              title="Error Loading Posts"
              description="There was a problem loading the blog posts."
              action={
                <Button onClick={refetch} className="bg-gradient-to-r from-primary to-purple-600">
                  Try Again
                </Button>
              }
            />
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              title={blogPosts.length === 0 ? "No blog posts yet" : "No posts match your filters"}
              description={
                blogPosts.length === 0 
                  ? "Create your first blog post to get started."
                  : "Try adjusting your search or filter criteria."
              }
              action={
                blogPosts.length === 0 ? (
                  <Button onClick={openCreate} className="bg-gradient-to-r from-primary to-purple-600">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                ) : null
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Title</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Author</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Views</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Likes</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-pink-700/10 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate text-zinc-900 dark:text-zinc-100">
                              {post.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <CategoryBadge category={post.category} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs">
                        {post.author}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">
                        {formatDate(post.date)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">
                        {post.views}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">
                        {post.likes}
                      </TableCell>
                      <TableCell>
                        <FeaturedBadge featured={post.featured} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-pink-700/20 text-pink-400 font-semibold text-xs sm:text-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs" onClick={() => openEdit(post)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Post
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-xs text-red-600 focus:text-red-600" 
                              onClick={() => setShowDelete(post)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={closeCreate}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new blog post.
            </DialogDescription>
          </DialogHeader>
          
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <BlogPostForm
            formData={formData}
            onFormChange={handleFormChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={closeCreate} disabled={formLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={formLoading}>
              {formLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Create Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!showEdit} onOpenChange={closeEdit}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the blog post information below.
            </DialogDescription>
          </DialogHeader>
          
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <BlogPostForm
            formData={formData}
            onFormChange={handleFormChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit} disabled={formLoading}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={formLoading}>
              {formLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!showDelete} onOpenChange={() => setShowDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The blog post will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-sm">{showDelete?.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                By {showDelete?.author} • {showDelete?.date && formatDate(showDelete.date)}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDelete(null)} 
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              disabled={formLoading} 
              variant="destructive"
            >
              {formLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}