"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SiriOrb from "@/components/SiriOrb"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { ImageGeneration } from "@/components/ui/ai-chat-image-generation-1"
import {
  ChevronDown,
  ChevronUp,
  X,
  Edit3,
  ChevronRight,
  MessageCircle,
  Send,
  Bot,
  Zap,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Paperclip,
  Smile,
  Search,
  Check,
  Eye,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Expand,
  Minimize2,
  Download,
  Share2,
  Globe,
  Shield,
  BarChart3,
  RefreshCw,
  BookOpen,
} from "lucide-react"

// Sample backend response data
const complianceData = {
  total_rules_checked: 16,
  rules_passed: 11,
  rules_failed: 4,
  rules_partial: 1,
  kb_rules_used: true,
  has_bbox: true,
  critical_issues: 3,
  rule_checks: [
    {
      rule_id: "VR-001",
      rule_title: "Presence of Regulatory Address Information",
      status: "PASSED",
      finding: "Found regulatory addresses for USA, Australia, and New Zealand: '3M Company 2510 Conway Avenue St. Paul, MN 55144 USA', '3M Australia Pty Ltd Building A, 1 Rivett Road North Ryde, NSW 2113', '3M New Zealand Ltd 94 Apollo Drive Rosedale, Auckland 0632'",
      location: {
        page: 1,
        text_found: "3M Company 2510 Conway Avenue St. Paul, MN 55144 USA",
        bbox: [365.68, 218.27, 419.62, 230.89]
      },
      compliant: true,
      recommendation: "None"
    },
    {
      rule_id: "VR-002",
      rule_title: "Presence of Regulatory Phone Number",
      status: "FAILED",
      finding: "Found phone number '1-800-537-2192' but required phone number is '1-800-537-2191'",
      location: {
        page: 1,
        text_found: "Questions? 1-800-537-219",
        bbox: [365.68, 194.06, 425.75, 201.38]
      },
      compliant: false,
      recommendation: "Update phone number from '1-800-537-2192' to '1-800-537-2191' as specified in requirements"
    },
    {
      rule_id: "VR-003",
      rule_title: "Presence and Format of Bar Code/UPC/GTIN",
      status: "PASSED",
      finding: "Found required GTIN '34-8726-5740-7' in correct format",
      location: {
        page: 1,
        text_found: "34-8726-5740-7",
        bbox: [365.68, 258.58, 401.91, 265.9]
      },
      compliant: true,
      recommendation: "None"
    },
    {
      rule_id: "VR-004",
      rule_title: "UDI Assessment Requirement – FDA Compliance",
      status: "PASSED",
      finding: "GTIN '34-8726-5740-7' appears to be formatted for FDA UDI Class I compliance and UPC barcode '051131995246' is present",
      location: {
        page: 1,
        text_found: "34-8726-5740-7",
        bbox: [365.68, 258.58, 401.91, 265.9]
      },
      compliant: true,
      recommendation: "None"
    },
    {
      rule_id: "VR-010",
      rule_title: "Recycling Symbol on Packaging",
      status: "FAILED",
      finding: "No recycling symbol found in the document text or mentioned in design assets",
      location: {
        page: 1,
        text_found: "No recycling symbol found",
        bbox: null
      },
      compliant: false,
      recommendation: "Add recycling symbol to packaging design to indicate environmental compliance"
    },
    {
      rule_id: "VR-013",
      rule_title: "Presence of Lot Code or Expiration/Date of Manufacture",
      status: "FAILED",
      finding: "No lot code, expiration date, or date of manufacture found in the required format (LOT/EXP/DOM followed by alphanumeric code)",
      location: {
        page: 1,
        text_found: "No traceability code found",
        bbox: null
      },
      compliant: false,
      recommendation: "Add lot code, expiration date, or date of manufacture in the approved format (e.g., 'LOT: ABCD1', 'EXP: 2F9D2', or 'DOM ABC123')"
    },
    {
      rule_id: "VR-014",
      rule_title: "Trademark Name and Symbol Display",
      status: "PARTIAL",
      finding: "Found 'TM' symbols but not the required '3M™' and 'Nexcare™' format. Found '3M' and 'TM' separately",
      location: {
        page: 1,
        text_found: "TM",
        bbox: [189.96, 154.49, 195.57, 160.19]
      },
      compliant: false,
      recommendation: "Ensure both '3M™' and 'Nexcare™' appear with proper trademark symbols attached directly to the brand names"
    }
  ]
}

export default function HomePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<number | null>(1)
  const [openReasons, setOpenReasons] = useState<Set<number>>(new Set())
  const [openMarkups, setOpenMarkups] = useState<Set<number>>(new Set())
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hi! I'm Pixl, your compliance assistant. I can help you understand FDA requirements and fix any issues with your product label. What would you like to know?",
      timestamp: "2024-01-15T13:42:00Z" // Fixed timestamp to prevent hydration issues
    }
  ])
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "failed" | "partial">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0)
  const [showMockup, setShowMockup] = useState(false)
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false)
  const [mockupImages] = useState([
    {
      src: "/3d/3d_model_20250830_005003_0.png",
      name: "Premium Packaging Design",
      id: "mockup-1"
    },
    {
      src: "/3d/3d_model_20250830_021611_0.png", 
      name: "Eco-Friendly Container",
      id: "mockup-2"
    },
    {
      src: "/3d/3d_model_20250901_094957_0.png",
      name: "Luxury Brand Package",
      id: "mockup-3"
    }
  ])
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [isDisclaimerExpanded, setIsDisclaimerExpanded] = useState(false)
  const [isMarkupMode, setIsMarkupMode] = useState(false)
  const [selectedRuleForMarkup, setSelectedRuleForMarkup] = useState<number | null>(null)
  const [isAgentSheetOpen, setIsAgentSheetOpen] = useState(false)
  const [isFeedbackSheetOpen, setIsFeedbackSheetOpen] = useState(false)
  const [isQuickActionsSheetOpen, setIsQuickActionsSheetOpen] = useState(false)
  const [isGenerateReportSheetOpen, setIsGenerateReportSheetOpen] = useState(false)
  const [isShareTeamSheetOpen, setIsShareTeamSheetOpen] = useState(false)
  const [isConsultantSheetOpen, setIsConsultantSheetOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [currentView, setCurrentView] = useState('consultants') // 'consultants' or 'profile'
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    category: '',
    message: '',
    email: ''
  })
  const [reportForm, setReportForm] = useState({
    format: 'pdf',
    includeImages: true,
    includeCharts: true,
    includeRecommendations: true,
    email: '',
    title: 'Compliance Report'
  })
  const [shareForm, setShareForm] = useState({
    selectedMembers: [] as string[],
    message: '',
    permissions: 'view',
    notify: true
  })
  const [consultantForm, setConsultantForm] = useState({
    urgency: 'all',
    budget: '',
    selectedConsultant: null as string | null
  })
  const [currentUser, setCurrentUser] = useState({
    firstName: 'User',
    lastName: 'Name',
    initials: 'UN'
  })

  // Calculate statistics
  const totalRules = complianceData.total_rules_checked
  const passedRules = complianceData.rules_passed
  const failedRules = complianceData.rules_failed
  const partialRules = complianceData.rules_partial || 0
  const passRate = Math.round((passedRules / totalRules) * 100)

  // Filter rules based on status
  const filteredRules = complianceData.rule_checks.filter(rule => {
    if (filterStatus === "all") return true
    if (filterStatus === "passed") return rule.status === "PASSED"
    if (filterStatus === "failed") return rule.status === "FAILED"
    if (filterStatus === "partial") return rule.status === "PARTIAL"
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASSED":
        return <CheckCircle className="w-4 h-4 text-[#00BD6F]" />
      case "FAILED":
        return <AlertCircle className="w-4 h-4 text-[#FC4E46]" />
      case "PARTIAL":
        return <Clock className="w-4 h-4 text-[#FFD13C]" />
      default:
        return <Clock className="w-4 h-4 text-[#4D4D4D]" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASSED":
        return "border-[#00BD6F] bg-[#F0F9F4]"
      case "FAILED":
        return "border-[#FC4E46] bg-[#FFF5F5]"
      case "PARTIAL":
        return "border-[#FFD13C] bg-[#FFF9E6]"
      default:
        return "border-[#4D4D4D] bg-[#F5F5F5]"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PASSED":
        return "Passed"
      case "FAILED":
        return "Failed"
      case "PARTIAL":
        return "Partial"
      default:
        return "Unknown"
    }
  }

  // Enhanced UI helper functions
  const getStatusVisual = (status: string) => {
    const visuals: Record<string, { icon: any; color: string; animation: string; bgColor: string }> = {
      'PASSED': { icon: CheckCircle, color: '#00BD6F', animation: 'pulse', bgColor: '#F0F9F4' },
      'FAILED': { icon: AlertCircle, color: '#FC4E46', animation: 'shake', bgColor: '#FFF5F5' },
      'PARTIAL': { icon: Clock, color: '#FFD13C', animation: 'glow', bgColor: '#FFF9E6' }
    }
    return visuals[status] || visuals['PARTIAL']
  }

  const getSeverityLevel = (status: string) => {
    switch (status) {
      case "FAILED":
        return "critical"
      case "PARTIAL":
        return "warning"
      case "PASSED":
        return "success"
      default:
        return "info"
    }
  }

  const simulateAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Helper function to get consistent timestamp
  const getCurrentTimestamp = () => {
    return new Date().toISOString()
  }

  // Enhanced chat functions inspired by Pixl design
  const generateUserInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return 'UN'
    const firstInitial = firstName.charAt(0).toUpperCase()
    const lastInitial = lastName.charAt(0).toUpperCase()
    return firstInitial + lastInitial
  }

  const setUserName = (firstName: string, lastName: string) => {
    setCurrentUser({
      firstName: firstName || 'User',
      lastName: lastName || 'Name',
      initials: generateUserInitials(firstName, lastName)
    })
  }

  const getContextualResponse = (userMessage: string) => {
    const contextualResponses: Record<string, string> = {
      "Check FDA compliance": "Great question! FDA compliance covers several key areas. What specific product type are you working with? Food, supplements, cosmetics, or medical devices?",
      "Review EU standards": "EU standards can be quite different from FDA requirements. Are you looking at food labeling, cosmetics, or another category? I can help you navigate the specific regulations.",
      "Allergen requirements": "Allergen labeling is crucial for safety. The major allergens that must be declared include milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, and soybeans. What's your specific concern?",
      "Nutrition facts format": "Nutrition facts formatting has specific requirements for font size, spacing, and layout. Are you designing a new label or updating an existing one?",
    }

    for (const [key, response] of Object.entries(contextualResponses)) {
      if (userMessage.toLowerCase().includes(key.toLowerCase())) {
        return response
      }
    }
    
    const responses = [
      "I can help you check that artwork for compliance issues. Could you upload the label image or share the specific requirements you need to verify?",
      "Based on the compliance standards, I've found a few areas that need attention. The allergen information should be bolded, and the nutrition facts need proper spacing.",
      "Perfect! Your label meets all the required standards. The ingredient list is properly formatted and all mandatory information is clearly visible.",
      "I notice this might be for the Australian market. Let me check it against ACCC guidelines and food labeling requirements.",
    ]
    
    const followUpQuestions = [
      "Would you like me to check any specific compliance areas?",
      "Do you have a particular product category in mind?",
      "Should I focus on any specific regulatory body?",
      "Would you like me to review a sample label for you?",
    ]
    
    const baseResponse = responses[Math.floor(Math.random() * responses.length)]
    const followUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]
    return `${baseResponse}\n\n${followUp}`
  }

  const typeMessage = (message: string) => {
    setIsTyping(true)
    const newMessage = {
      id: chatMessages.length + 1,
      type: "bot" as const,
      message: "",
      timestamp: getCurrentTimestamp()
    }
    setChatMessages(prev => [...prev, newMessage])
    
    let charIndex = 0
    const typingSpeed = 25
    
    const type = () => {
      if (charIndex < message.length) {
        setChatMessages(prev => 
          prev.map((msg, index) => 
            index === prev.length - 1 
              ? { ...msg, message: message.substring(0, charIndex + 1) }
              : msg
          )
        )
        charIndex++
        setTimeout(type, typingSpeed + Math.random() * 15 - 7)
      } else {
        setIsTyping(false)
      }
    }
    type()
  }

  const askQuestion = (question: string) => {
    setChatMessage(question)
    handleSendMessage()
  }

  const handleMarkup = (ruleIndex: number) => {
    setSelectedRuleForMarkup(ruleIndex)
    setIsMarkupMode(true)
  }

  const exitMarkupMode = () => {
    setIsMarkupMode(false)
    setSelectedRuleForMarkup(null)
  }

  // Mock agents data for CPG
  const mockAgents = [
    {
      id: 'image-gen',
      name: 'Image Generation Agent',
      description: 'Generate product images, mockups, and visualizations',
      icon: '🎨',
      status: 'active',
      capabilities: ['Product mockups', 'Label designs', 'Packaging visuals', '3D renders']
    },
    {
      id: 'trademark-check',
      name: 'Trademark Verification Agent',
      description: 'Check trademark availability and compliance',
      icon: '⚖️',
      status: 'active',
      capabilities: ['Trademark search', 'Legal compliance', 'Conflict detection', 'Registration status']
    },
    {
      id: 'nutrition-analyzer',
      name: 'Nutrition Facts Analyzer',
      description: 'Analyze and validate nutrition information',
      icon: '🥗',
      status: 'active',
      capabilities: ['Nutrition validation', 'FDA compliance', 'Allergen detection', 'Format checking']
    },
    {
      id: 'ingredient-scanner',
      name: 'Ingredient Scanner Agent',
      description: 'Scan and validate ingredient lists',
      icon: '🔍',
      status: 'active',
      capabilities: ['Ingredient validation', 'Allergen detection', 'Chemical analysis', 'Safety checks']
    },
    {
      id: 'market-research',
      name: 'Market Research Agent',
      description: 'Analyze market trends and competitor data',
      icon: '📊',
      status: 'active',
      capabilities: ['Trend analysis', 'Competitor research', 'Market sizing', 'Consumer insights']
    },
    {
      id: 'compliance-monitor',
      name: 'Compliance Monitor Agent',
      description: 'Monitor ongoing compliance across markets',
      icon: '🛡️',
      status: 'active',
      capabilities: ['Real-time monitoring', 'Alert system', 'Regulatory updates', 'Risk assessment']
    }
  ]

  const handleAgentRun = (agentId: string) => {
    console.log(`Running agent: ${agentId}`)
    // Simulate agent execution
    alert(`Starting ${mockAgents.find(a => a.id === agentId)?.name}...`)
  }

  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', feedbackForm)
    alert('Thank you for your feedback!')
    setFeedbackForm({ rating: 0, category: '', message: '', email: '' })
    setIsFeedbackSheetOpen(false)
  }

  const handleReportGenerate = () => {
    console.log('Report generation started:', reportForm)
    alert(`Generating ${reportForm.format.toUpperCase()} report: "${reportForm.title}"`)
    setIsGenerateReportSheetOpen(false)
  }

  const handleShareSubmit = () => {
    console.log('Sharing with team:', shareForm)
    const selectedMembers = mockTeamMembers.filter(member => shareForm.selectedMembers.includes(member.id))
    const memberNames = selectedMembers.map(member => member.name).join(', ')
    alert(`Sharing compliance results with: ${memberNames}`)
    setShareForm({ selectedMembers: [], message: '', permissions: 'view', notify: true })
    setIsShareTeamSheetOpen(false)
  }

  const handleMemberToggle = (memberId: string) => {
    setShareForm(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId]
    }))
  }

  // Mock consultants data
  const mockConsultants = [
    {
      id: 'consultant-1',
      name: 'Dr. Sarah Chen',
      title: 'Senior FDA Compliance Specialist',
      company: 'Regulatory Solutions Inc.',
      experience: '12 years',
      specialties: ['FDA Regulations', 'Food Safety', 'Labeling Compliance'],
      availability: 'immediate',
      rate: '$450/hour',
      rating: 4.9,
      reviews: 127,
      languages: ['English', 'Mandarin'],
      location: 'San Francisco, CA',
      verified: true,
      responseTime: '2-4 hours',
      description: 'Expert in FDA food labeling regulations with extensive experience in CPG compliance audits.',
      avatarUrl: '/uifaces-human-avatar.jpg'
    },
    {
      id: 'consultant-2',
      name: 'Michael Rodriguez',
      title: 'EU Compliance Auditor',
      company: 'Global Compliance Partners',
      experience: '8 years',
      specialties: ['EU Regulations', 'Nutrition Claims', 'Allergen Management'],
      availability: '2-days',
      rate: '$350/hour',
      rating: 4.8,
      reviews: 89,
      languages: ['English', 'Spanish', 'French'],
      location: 'Brussels, Belgium',
      verified: true,
      responseTime: '24-48 hours',
      description: 'Specialized in European food law and cross-border compliance requirements.',
      avatarUrl: '/uifaces-human-avatar (1).jpg'
    },
    {
      id: 'consultant-3',
      name: 'Jennifer Walsh',
      title: 'Multi-Market Compliance Expert',
      company: 'Compliance Advisory Group',
      experience: '15 years',
      specialties: ['Global Regulations', 'Supply Chain', 'Risk Assessment'],
      availability: '7-days',
      rate: '$300/hour',
      rating: 4.9,
      reviews: 203,
      languages: ['English', 'German', 'Italian'],
      location: 'London, UK',
      verified: true,
      responseTime: '3-5 business days',
      description: 'Comprehensive expertise across multiple markets with focus on complex regulatory landscapes.',
      avatarUrl: '/uifaces-human-avatar (2).jpg'
    },
    {
      id: 'consultant-4',
      name: 'David Kim',
      title: 'Packaging & Labeling Specialist',
      company: 'Design Compliance Co.',
      experience: '10 years',
      specialties: ['Packaging Design', 'Label Requirements', 'Visual Compliance'],
      availability: 'immediate',
      rate: '$400/hour',
      rating: 4.7,
      reviews: 156,
      languages: ['English', 'Korean'],
      location: 'Seoul, South Korea',
      verified: true,
      responseTime: '4-6 hours',
      description: 'Expert in packaging design compliance and visual regulatory requirements.',
      avatarUrl: '/uifaces-human-avatar (3).jpg'
    },
    {
      id: 'consultant-5',
      name: 'Dr. Maria Santos',
      title: 'Nutrition & Health Claims Expert',
      company: 'Health Compliance Solutions',
      experience: '14 years',
      specialties: ['Nutrition Claims', 'Health Claims', 'Scientific Validation'],
      availability: '2-days',
      rate: '$425/hour',
      rating: 4.8,
      reviews: 94,
      languages: ['English', 'Portuguese', 'Spanish'],
      location: 'São Paulo, Brazil',
      verified: true,
      responseTime: '24-48 hours',
      description: 'Specialized in nutrition and health claim regulations across multiple jurisdictions.',
      avatarUrl: '/uifaces-human-avatar (4).jpg'
    },
    {
      id: 'consultant-6',
      name: 'James Thompson',
      title: 'Supply Chain Compliance Auditor',
      company: 'Global Audit Partners',
      experience: '11 years',
      specialties: ['Supply Chain', 'Traceability', 'Quality Systems'],
      availability: '7-days',
      rate: '$325/hour',
      rating: 4.6,
      reviews: 78,
      languages: ['English'],
      location: 'Toronto, Canada',
      verified: true,
      responseTime: '5-7 business days',
      description: 'Expert in supply chain compliance and traceability requirements for food products.',
      avatarUrl: '/uifaces-human-avatar (5).jpg'
    }
  ]

  // Mock team members data
  const mockTeamMembers = [
    {
      id: 'member-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@govisually.com',
      role: 'Compliance Manager',
      department: 'Legal & Compliance',
      avatar: '/uifaces-human-avatar.jpg',
      status: 'online'
    },
    {
      id: 'member-2',
      name: 'Michael Chen',
      email: 'michael.chen@govisually.com',
      role: 'Senior Designer',
      department: 'Creative',
      avatar: '/uifaces-human-avatar (1).jpg',
      status: 'online'
    },
    {
      id: 'member-3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@govisually.com',
      role: 'Product Manager',
      department: 'Product',
      avatar: '/uifaces-human-avatar (2).jpg',
      status: 'away'
    },
    {
      id: 'member-4',
      name: 'David Kim',
      email: 'david.kim@govisually.com',
      role: 'QA Engineer',
      department: 'Engineering',
      avatar: '/uifaces-human-avatar (3).jpg',
      status: 'online'
    },
    {
      id: 'member-5',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@govisually.com',
      role: 'Marketing Director',
      department: 'Marketing',
      avatar: '/uifaces-human-avatar (4).jpg',
      status: 'offline'
    },
    {
      id: 'member-6',
      name: 'James Wilson',
      email: 'james.wilson@govisually.com',
      role: 'Account Executive',
      department: 'Sales',
      avatar: '/uifaces-human-avatar (5).jpg',
      status: 'online'
    }
  ]

  const handleConsultantEngage = (consultantId: string) => {
    const consultant = mockConsultants.find(c => c.id === consultantId)
    console.log('Engaging consultant:', consultant)
    alert(`Engaging ${consultant?.name} for compliance review. They will be notified and can access your artwork and compliance data.`)
    setConsultantForm(prev => ({ ...prev, selectedConsultant: consultantId }))
  }

  const handleConsultantSubmit = () => {
    console.log('Consultant engagement submitted:', consultantForm)
    alert('Consultant engagement request submitted! You will receive confirmation shortly.')
    setConsultantForm({ urgency: 'all', budget: '', selectedConsultant: null })
    setIsConsultantSheetOpen(false)
  }

  const handleProfileOpen = (consultant: any) => {
    setSelectedProfile(consultant)
    setCurrentView('profile')
  }

  const handleProfileClose = () => {
    setCurrentView('consultants')
    setSelectedProfile(null)
  }

  const toggleReason = (itemId: number) => {
    const newOpenReasons = new Set(openReasons)
    if (newOpenReasons.has(itemId)) {
      newOpenReasons.delete(itemId)
    } else {
      newOpenReasons.add(itemId)
    }
    setOpenReasons(newOpenReasons)
  }

  const toggleMarkup = (itemId: number) => {
    const newOpenMarkups = new Set(openMarkups)
    if (newOpenMarkups.has(itemId)) {
      newOpenMarkups.delete(itemId)
    } else {
      newOpenMarkups.add(itemId)
    }
    setOpenMarkups(newOpenMarkups)
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        type: "user" as const,
        message: chatMessage,
        timestamp: getCurrentTimestamp()
      }
      setChatMessages(prev => [...prev, newMessage])
      const userMessage = chatMessage
      setChatMessage("")
      
      // Show thinking state first
      setIsThinking(true)
      
      // Simulate bot response with enhanced typing animation
      setTimeout(() => {
        setIsThinking(false)
        const responseContent = getContextualResponse(userMessage)
        typeMessage(responseContent)
      }, 1000 + Math.random() * 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDownloadMockup = (imageSrc: string, productName: string) => {
    const link = document.createElement('a')
    link.href = imageSrc
    link.download = `${productName.replace(/\s+/g, '_')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleGenerateMockup = () => {
    setIsGeneratingMockup(true)
    setShowMockup(true)
    
    // Add a message to chat about mockup generation starting
    const currentMockup = mockupImages[currentMockupIndex]
    const mockupMessage = {
      id: chatMessages.length + 1,
      type: "bot" as const,
      message: `Generating 3D mockup: "${currentMockup.name}". This may take a moment...`,
      timestamp: getCurrentTimestamp()
    }
    setChatMessages(prev => [...prev, mockupMessage])
    
    // Simulate generation time (3-4 seconds)
    setTimeout(() => {
      setIsGeneratingMockup(false)
      // Add completion message
      const completionMessage = {
        id: chatMessages.length + 2,
        type: "bot" as const,
        message: `3D mockup generated! You can download it by clicking the download button on the image.`,
        timestamp: getCurrentTimestamp()
      }
      setChatMessages(prev => [...prev, completionMessage])
    }, 3500)
    
    // Move to next mockup for next time
    setCurrentMockupIndex((prev) => (prev + 1) % mockupImages.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#111111] mb-2">Compliance Review</h1>
              <p className="text-[#4D4D4D]">Review and manage compliance results for your document</p>
            </div>
          <Button
            onClick={() => setIsSheetOpen(true)}
              className="bg-[#FC4E46] hover:bg-[#E0453E] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
              Open compliance summary
          </Button>
          </div>
          
          {/* PDF Viewer */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-[#EDEDED] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#6B7280]" />
                  <div>
                    <h3 className="font-semibold text-[#111111]">588-20PB_P CTN_6-5740-7-compressed.pdf</h3>
                    <p className="text-sm text-[#6B7280]">Document preview</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-[#111111] border-[#4D4D4D] hover:bg-[#F0F0F0]">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="text-[#111111] border-[#4D4D4D] hover:bg-[#F0F0F0]">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            {/* PDF Embed */}
            <div className="h-[800px] w-full relative">
              <iframe
                src="/588-20PB_P CTN_6-5740-7-compressed.pdf"
                className="w-full h-full border-0"
                title="PDF Document Preview"
              />
              
              {/* Markup Overlay */}
              {isMarkupMode && selectedRuleForMarkup !== null && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Show all bounding boxes for the selected rule */}
                  {complianceData.rule_checks
                    .filter((rule, index) => index === selectedRuleForMarkup && rule.location?.bbox)
                    .map((rule, index) => (
                      <div
                        key={index}
                        className="absolute border-4 border-[#FC4E46] bg-[#FC4E46]/20 pointer-events-auto rounded-lg shadow-lg"
                        style={{
                          left: `${rule.location.bbox![0]}px`,
                          top: `${rule.location.bbox![1]}px`,
                          width: `${rule.location.bbox![2] - rule.location.bbox![0]}px`,
                          height: `${rule.location.bbox![3] - rule.location.bbox![1]}px`,
                        }}
                      >
                        {/* Corner indicators */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#FC4E46] rounded-full"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FC4E46] rounded-full"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#FC4E46] rounded-full"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FC4E46] rounded-full"></div>
                        
                        {/* Rule title label */}
                        <div className="absolute -top-10 left-0 bg-[#FC4E46] text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap font-medium shadow-md">
                          {rule.rule_title}
                        </div>
                        
                        {/* Status label */}
                        <div className="absolute -bottom-10 left-0 bg-[#FC4E46] text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap font-medium shadow-md">
                          Status: {rule.status}
                        </div>
                      </div>
                    ))}
                  
                  {/* Show all other bounding boxes with different styling */}
                  {complianceData.rule_checks
                    .filter((rule, index) => index !== selectedRuleForMarkup && rule.location?.bbox)
                    .map((rule, index) => (
                      <div
                        key={`other-${index}`}
                        className="absolute border-2 border-[#6B7280] bg-[#6B7280]/10 pointer-events-auto rounded-md shadow-sm"
                        style={{
                          left: `${rule.location.bbox![0]}px`,
                          top: `${rule.location.bbox![1]}px`,
                          width: `${rule.location.bbox![2] - rule.location.bbox![0]}px`,
                          height: `${rule.location.bbox![3] - rule.location.bbox![1]}px`,
                        }}
                      >
                        {/* Subtle corner indicators */}
                        <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-[#6B7280] rounded-full"></div>
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#6B7280] rounded-full"></div>
                        <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-[#6B7280] rounded-full"></div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#6B7280] rounded-full"></div>
                      </div>
                    ))}
                  
                  {/* Exit Markup Mode Button */}
                  <div className="absolute top-4 right-4 pointer-events-auto">
                    <Button
                      onClick={exitMarkupMode}
                      size="sm"
                      variant="outline"
                      className="bg-white/90 hover:bg-white text-[#FC4E46] border-[#FC4E46]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Exit Markup
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" 
          onClick={() => setIsSheetOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Side Sheet */}
      {isSheetOpen && (
        <div
          className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compliance-summary-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDEDED] bg-white">
            <div className="flex items-center gap-4">
              <h2 id="compliance-summary-title" className="text-xl font-bold text-[#111111]">Compliance summary</h2>
              <Badge variant="outline" className="border-[#0D6ABE] text-[#0D6ABE] bg-[#F3F8FC]">
                FDA requirements
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSheetOpen(false)}
              className="h-8 w-8 p-0 hover:bg-[#F5F5F5] transition-colors"
              aria-label="Close compliance review"
            >
              <X className="h-4 w-4 text-[#4D4D4D]" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 bg-[#F5F5F5] border-b border-[#EDEDED]">
              <p className="text-[#4D4D4D] text-sm leading-relaxed">
                This is a <span className="text-[#0D6ABE] font-medium">food product label</span> for{" "}
                <span className="text-[#0D6ABE] font-medium">Organic Granola Bars</span> manufactured by{" "}
                <span className="text-[#00BD6F] font-medium">Nature's Best Foods</span>. The label requires compliance
                with <span className="text-[#0D6ABE] font-medium">FDA regulations</span> for nutritional labeling,
                ingredient disclosure, and <span className="text-[#0D6ABE] font-medium">allergen warnings</span> under{" "}
                <span className="text-[#0D6ABE] font-medium">21 CFR Part 101</span>.
              </p>
            </div>

            <div className="p-6">
              {/* Enhanced Statistics Overview with Executive Summary */}
              <div className="mb-6">
                {/* Executive Summary - Always Visible */}
                <div className="bg-gradient-to-r from-[#F3F8FC] to-[#F0F9F4] rounded-xl p-6 mb-6 border border-[#E7F0F8]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#111111]">Compliance overview</h3>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#00BD6F]">{passRate}%</div>
                        <div className="text-[#4D4D4D] text-sm">pass rate</div>
                      </div>
                      <div className="w-16 h-16 relative">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#00BD6F"
                            strokeWidth="2"
                            strokeDasharray={`${passRate}, 100`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#00BD6F]">{passRate}%</span>
                        </div>
                      </div>
                </div>
              </div>

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FC4E46]">{failedRules}</div>
                      <div className="text-xs text-[#4D4D4D]">Critical issues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FFD13C]">{partialRules}</div>
                      <div className="text-xs text-[#4D4D4D]">Warnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#0D6ABE]">{totalRules}</div>
                      <div className="text-xs text-[#4D4D4D]">Total rules</div>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-[#F5F5F5] rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-[#00BD6F] to-[#7BCDDA] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${passRate}%` }}
                  ></div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="text-center p-3 bg-[#F0F9F4] rounded-lg border border-[#00BD6F]/20">
                    <div className="text-xl font-bold text-[#00BD6F]">{passedRules}</div>
                    <div className="text-xs text-[#4D4D4D]">Passed</div>
                  </div>
                  <div className="text-center p-3 bg-[#FFF5F5] rounded-lg border border-[#FC4E46]/20">
                    <div className="text-xl font-bold text-[#FC4E46]">{failedRules}</div>
                    <div className="text-xs text-[#4D4D4D]">Failed</div>
                  </div>
                  <div className="text-center p-3 bg-[#FFF9E6] rounded-lg border border-[#FFD13C]/20">
                    <div className="text-xl font-bold text-[#FFD13C]">{partialRules}</div>
                    <div className="text-xs text-[#4D4D4D]">Partial</div>
                  </div>
                  <div className="text-center p-3 bg-[#F3F8FC] rounded-lg border border-[#0D6ABE]/20">
                    <div className="text-xl font-bold text-[#0D6ABE]">{totalRules}</div>
                    <div className="text-xs text-[#4D4D4D]">Total</div>
                  </div>
                </div>

                {/* Enhanced Filter System with Smart Search */}
                <div className="space-y-4">
                  {/* Smart Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4D4D4D] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search rules, violations, or recommendations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BCDDA] focus:border-transparent"
                    />
                  </div>
                  
                  {/* Visual Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("all")}
                      className={`rounded-full px-4 py-2 transition-all duration-200 ${
                        filterStatus === "all" 
                          ? "bg-[#0D6ABE] text-white shadow-md" 
                          : "border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]"
                      }`}
                    >
                      All ({totalRules})
                    </Button>
                    <Button
                      variant={filterStatus === "failed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("failed")}
                      className={`rounded-full px-4 py-2 transition-all duration-200 ${
                        filterStatus === "failed" 
                          ? "bg-[#FC4E46] text-white shadow-md" 
                          : "border-[#FC4E46] text-[#FC4E46] hover:bg-[#FFF5F5]"
                      }`}
                    >
                      Critical ({failedRules})
                    </Button>
                    <Button
                      variant={filterStatus === "passed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("passed")}
                      className={`rounded-full px-4 py-2 transition-all duration-200 ${
                        filterStatus === "passed" 
                          ? "bg-[#00BD6F] text-white shadow-md" 
                          : "border-[#00BD6F] text-[#00BD6F] hover:bg-[#F0F9F4]"
                      }`}
                    >
                      Passed ({passedRules})
                    </Button>
                    <Button
                      variant={filterStatus === "partial" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("partial")}
                      className={`rounded-full px-4 py-2 transition-all duration-200 ${
                        filterStatus === "partial" 
                          ? "bg-[#FFD13C] text-white shadow-md" 
                          : "border-[#FFD13C] text-[#FFD13C] hover:bg-[#FFF9E6]"
                      }`}
                    >
                      Warnings ({partialRules})
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Auto Compliance Check Button */}
              <div className="mb-6">
                <Button 
                  onClick={simulateAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-[#FC4E46] hover:bg-[#E0453E] text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing compliance... {analysisProgress}%
                    </>
                  ) : (
                    <>
                <Edit3 className="w-4 h-4 mr-2" />
                      Auto compliance check
                    </>
                  )}
              </Button>
                
                {/* Progress Bar for Analysis */}
                {isAnalyzing && (
                  <div className="mt-3 w-full bg-[#F5F5F5] rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#FC4E46] to-[#FFD13C] h-2 rounded-full transition-all duration-200"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {filteredRules.map((rule, index) => (
                  <div key={rule.rule_id} className={`bg-white border rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200 ${
                    rule.status === 'PASSED' ? 'border-[#00BD6F]/30' : 
                    rule.status === 'FAILED' ? 'border-[#FC4E46]/30' : 
                    rule.status === 'PARTIAL' ? 'border-[#FFD13C]/30' : 
                    'border-[#6B7280]/30'
                  }`}>
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F9F9F9] transition-colors"
                      onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setExpandedItem(expandedItem === index ? null : index)}
                      aria-expanded={expandedItem === index}
                    >
                      <Checkbox id={rule.rule_id} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(rule.status)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] text-[#6B7280] font-mono">{rule.rule_id}</span>
                                <div className={`w-2 h-2 rounded-full ${
                                  rule.status === 'PASSED' ? 'bg-[#00BD6F]' : 
                                  rule.status === 'FAILED' ? 'bg-[#FC4E46]' : 
                                  'bg-[#FFD13C]'
                                }`} />
                              </div>
                              <span className="font-medium text-[#111111] text-sm">{rule.rule_title}</span>
                            </div>
                          </div>
                          {expandedItem === index ? (
                            <ChevronUp className="w-4 h-4 text-[#4D4D4D]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#4D4D4D]" />
                          )}
                      </div>
                    </div>
                  </div>

                    {expandedItem === index && (
                      <div className="px-4 pb-4 border-t border-[#EDEDED] bg-[#F9F9F9]">
                      <div className="mt-3 mb-4">
                          <p className="text-[#4D4D4D] text-sm leading-relaxed">
                            {rule.finding}
                          </p>
                          {rule.location.text_found && (
                            <p className="text-[#00BD6F] text-sm mt-2 font-medium">
                              Found: "{rule.location.text_found}" (Page {rule.location.page})
                            </p>
                          )}
                      </div>

                        {rule.recommendation && rule.recommendation !== "None" && (
                      <div className="space-y-3">
                        <div>
                          <div
                                className="flex items-center justify-between py-2 cursor-pointer border-b border-[#EDEDED] hover:bg-[#F5F5F5] rounded px-2 -mx-2"
                                onClick={() => toggleReason(index)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && toggleReason(index)}
                              >
                                <span className="text-[#0D6ABE] font-medium">Reason</span>
                                {openReasons.has(index) ? (
                                  <ChevronUp className="w-4 h-4 text-[#4D4D4D]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[#4D4D4D]" />
                            )}
                          </div>
                              {openReasons.has(index) && (
                                <div className="py-3 text-sm text-[#4D4D4D] leading-relaxed">
                                  {rule.status === "FAILED" 
                                    ? "This validation rule failed because the required information is missing, incorrect, or not in the proper format as specified by regulatory requirements."
                                    : rule.status === "PARTIAL"
                                    ? "This validation rule partially passed but requires attention to meet full compliance standards."
                                    : "This validation rule passed all requirements and meets compliance standards."
                                  }
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <div
                                  className="flex items-center justify-between py-2 cursor-pointer border-b border-[#EDEDED] flex-1 hover:bg-[#F5F5F5] rounded px-2 -mx-2"
                                  onClick={() => toggleMarkup(index)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => e.key === 'Enter' && toggleMarkup(index)}
                                >
                                  <span className="text-[#0D6ABE] font-medium">Recommendation</span>
                                  {openMarkups.has(index) ? (
                                    <ChevronUp className="w-4 h-4 text-[#4D4D4D]" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[#4D4D4D]" />
                              )}
                            </div>
                                <RainbowButton
                                  onClick={() => setIsChatOpen(true)}
                                  className="h-8 px-3 text-sm"
                                >
                                  <div className="mr-2">
                                    <SiriOrb 
                                      size="14px" 
                                      animationDuration={12}
                                      className="drop-shadow-sm"
                                    />
                          </div>
                                  <span>Ask Pixl</span>
                                </RainbowButton>
                          </div>
                              {openMarkups.has(index) && (
                            <div className="py-3">
                                  <div className="bg-[#F3F8FC] p-3 rounded text-sm text-[#0D6ABE] mb-3 border border-[#E7F0F8]">
                                    <strong>Recommendation:</strong> {rule.recommendation}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                      className="bg-[#FC4E46] hover:bg-[#E0453E] text-white"
                                      onClick={() => handleMarkup(index)}
                                >
                                      Markup
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                        )}
                    </div>
                  )}
                  </div>
                ))}
                </div>

              
              {/* Actions */}
              <div className="border-t border-[#EDEDED] pt-6">
                <h4 className="text-lg font-bold text-[#111111] mb-4">Actions</h4>
                
                
                <div className="space-y-3">
                  <RainbowButton 
                    onClick={() => setIsChatOpen(true)}
                    className="w-full h-11 px-4 justify-between"
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <SiriOrb 
                          size="16px" 
                          animationDuration={12}
                          className="drop-shadow-lg"
                        />
                      </div>
                      <span className="font-medium">Chat with Pixl</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </RainbowButton>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#00BD6F] text-[#00BD6F] hover:bg-[#F0F9F4] bg-transparent transition-all duration-200"
                    onClick={() => setIsFeedbackSheetOpen(true)}
                  >
                    <div className="flex items-center">
                      <Send className="w-4 h-4 mr-3" />
                      Send feedback
                  </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC] bg-transparent transition-all duration-200"
                    onClick={() => setIsAgentSheetOpen(true)}
                  >
                    <div className="flex items-center">
                      <Bot className="w-4 h-4 mr-3" />
                      Run agent
                  </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#4D4D4D] text-[#4D4D4D] hover:bg-[#F5F5F5] bg-transparent transition-all duration-200"
                    onClick={() => setIsQuickActionsSheetOpen(true)}
                  >
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-3" />
                      Quick actions
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>


                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC] bg-transparent transition-all duration-200"
                    onClick={() => setIsGenerateReportSheetOpen(true)}
                  >
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-3" />
                      Generate report
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#FC4E46] text-[#FC4E46] hover:bg-[#FFF5F5] bg-transparent transition-all duration-200"
                    onClick={() => setIsShareTeamSheetOpen(true)}
                  >
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3" />
                      Share with team
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F3F0FF] bg-transparent transition-all duration-200"
                    onClick={() => setIsConsultantSheetOpen(true)}
                  >
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-3" />
                      Engage expert
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Disclaimer Bar */}
          <div className={`fixed bottom-0 left-0 right-0 bg-[#F5F5F5] border-t border-[#EDEDED] z-50 transition-all duration-300 ease-in-out ${
            isDisclaimerExpanded ? 'py-2' : 'py-1.5'
          }`}>
            <div className="px-4">
              <div className="flex items-center justify-between text-[10px] text-[#4D4D4D]">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-2.5 h-2.5" />
                  <span>Powered by GoVisually Pixl AI</span>
                </div>
                <button 
                  className="text-[#0D6ABE] hover:text-[#0B5AA1] underline transition-colors duration-200 flex items-center gap-1"
                  onClick={() => setIsDisclaimerExpanded(!isDisclaimerExpanded)}
                >
                  AI Disclaimer
                  <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${
                    isDisclaimerExpanded ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>
              
              {/* Expanded Disclaimer Content */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isDisclaimerExpanded ? 'max-h-28 opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}>
                <div className="text-[10px] text-[#4D4D4D] leading-tight space-y-1.5">
                  <p className="font-medium text-[#111111]">AI Disclaimer</p>
                  <p>
                    This tool uses artificial intelligence to assist with compliance checking. 
                    Results should be verified by qualified professionals. AI-generated content 
                    may not be 100% accurate and should not be the sole basis for regulatory decisions.
                  </p>
                  <p>
                    Always consult with compliance experts and regulatory authorities for 
                    final validation of any compliance-related decisions.
                  </p>
                      </div>
                    </div>
                </div>
          </div>
        </div>
                </div>
      )}

      {/* Chat Modal - Higher z-index to layer on top */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300" 
          onClick={() => setIsChatOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat Interface */}
      {isChatOpen && (
        <div
          className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-[70] transform transition-all duration-300 ease-in-out ${isChatExpanded ? "w-full" : "w-[480px]"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
        >
        <div className="flex flex-col h-full">
          {/* Enhanced Chat Header with Pixl Avatar */}
          <div className="bg-[#000000] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Back to compliance review"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {/* Pixl Avatar */}
              <div className="w-10 h-10">
                <SiriOrb 
                  size="40px" 
                  animationDuration={15}
                  state={isTyping ? 'typing' : isThinking ? 'thinking' : 'idle'}
                  className="drop-shadow-lg"
                />
                      </div>
              <div>
                <h2 id="chat-title" className="text-lg font-semibold">Pixl</h2>
                <p className="text-sm opacity-90">
                  {isTyping ? 'Typing...' : isThinking ? 'Thinking...' : 'I\'m here to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserName('Jim', 'Bloggs')}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Demo user names"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatExpanded(!isChatExpanded)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label={isChatExpanded ? "Minimize chat" : "Expand chat"}
              >
                {isChatExpanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
                    </div>
                  </div>

          {/* Quick Actions */}
          <div className="p-4 bg-[#F9F9F9] border-b border-[#EDEDED]">
            <div className={`flex flex-wrap gap-2 ${isChatExpanded ? 'max-w-4xl mx-auto' : ''}`}>
              <button
                onClick={() => askQuestion('Check FDA compliance')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EDEDED] rounded-full hover:bg-[#0D6ABE] hover:text-white hover:border-[#0D6ABE] transition-all duration-200"
              >
                Check FDA compliance
              </button>
              <button
                onClick={() => askQuestion('Review EU standards')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EDEDED] rounded-full hover:bg-[#0D6ABE] hover:text-white hover:border-[#0D6ABE] transition-all duration-200"
              >
                Review EU standards
              </button>
              <button
                onClick={() => askQuestion('Allergen requirements')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EDEDED] rounded-full hover:bg-[#0D6ABE] hover:text-white hover:border-[#0D6ABE] transition-all duration-200"
              >
                Allergen requirements
              </button>
              <button
                onClick={() => askQuestion('Nutrition facts format')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EDEDED] rounded-full hover:bg-[#0D6ABE] hover:text-white hover:border-[#0D6ABE] transition-all duration-200"
              >
                Nutrition facts format
              </button>
              <button
                onClick={handleGenerateMockup}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#8B5CF6] rounded-full hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] transition-all duration-200"
              >
                🎨 Generate 3D
              </button>
            </div>
          </div>

          {/* Enhanced Chat Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isChatExpanded ? 'max-w-4xl mx-auto w-full' : ''}`}>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  msg.type === 'user' 
                    ? 'bg-[#0D6ABE] text-white' 
                    : 'bg-[#F5F5F5] text-[#4D4D4D]'
                }`}>
                  {msg.type === 'user' ? currentUser.initials : 'P'}
                </div>
                
                {/* Message Content */}
                <div className={`max-w-[80%] ${msg.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`relative group ${
                    msg.type === 'user' 
                      ? 'bg-[#FC4E46] text-white' 
                      : 'bg-[#F5F5F5] text-[#111111]'
                  } rounded-2xl px-4 py-3 shadow-sm`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    
                    {/* Copy Button */}
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.message)}
                      className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#EDEDED] hover:bg-[#D1D5DB] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                  <p className={`text-xs mt-1 px-1 ${
                    msg.type === 'user' ? 'text-[#4D4D4D]' : 'text-[#6B7280]'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center text-xs font-semibold text-[#4D4D4D]">
                  P
                </div>
                <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#0D6ABE] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#0D6ABE] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#0D6ABE] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                      </div>
                    </div>
                  )}

            {/* Mockup Display */}
            {showMockup && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center text-xs font-semibold text-[#4D4D4D]">
                    P
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#F5F5F5] rounded-2xl p-4">
                      <h3 className="font-semibold text-[#111111] mb-3">
                        {isGeneratingMockup ? "Generating 3D Mockup..." : "3D Mockup Generated"}
                      </h3>
                      {isGeneratingMockup ? (
                        <div className="flex justify-center">
                          <div className="w-full max-w-2xl">
                            <ImageGeneration>
                              <div className="relative group">
                                <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">
                                  <img
                                    src={mockupImages[currentMockupIndex].src}
                                    alt={mockupImages[currentMockupIndex].name}
                                    className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  
                                  {/* Product Name Overlay */}
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                    <p className="text-white font-medium text-sm">{mockupImages[currentMockupIndex].name}</p>
                                  </div>
                                </div>
                              </div>
                            </ImageGeneration>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="w-full max-w-2xl">
                            <div className="relative group">
                              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">
                                <img
                                  src={mockupImages[currentMockupIndex].src}
                                  alt={mockupImages[currentMockupIndex].name}
                                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                
                                {/* Download Button - Bottom Right */}
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <button
                                    onClick={() => handleDownloadMockup(mockupImages[currentMockupIndex].src, mockupImages[currentMockupIndex].name)}
                                    className="bg-black/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/40 transition-colors duration-200 flex items-center justify-center"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                {/* Product Name Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                  <p className="text-white font-medium text-sm">{mockupImages[currentMockupIndex].name}</p>
                                </div>
                              </div>
                              
                              {/* Variation Suggestions - Under Image */}
                              <div className="mt-2 text-center">
                                <p className="text-xs text-[#6B7280] mb-2">Would you also like to try:</p>
                                <div className="flex flex-wrap justify-center gap-1">
                                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#4D4D4D] rounded-full hover:bg-[#8B5CF6] hover:text-white transition-colors duration-200">
                                    Social Ads
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#4D4D4D] rounded-full hover:bg-[#8B5CF6] hover:text-white transition-colors duration-200">
                                    Retail Shelf
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#4D4D4D] rounded-full hover:bg-[#8B5CF6] hover:text-white transition-colors duration-200">
                                    E-commerce
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-[#F5F5F5] text-[#4D4D4D] rounded-full hover:bg-[#8B5CF6] hover:text-white transition-colors duration-200">
                                    Marketing Kit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
                </div>

          {/* Enhanced Chat Input */}
          <div className="border-t border-[#EDEDED] p-4 bg-white">
            <div className={`flex items-end gap-3 ${isChatExpanded ? 'max-w-4xl mx-auto' : ''}`}>
              <div className="flex-1 relative">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about compliance..."
                  className="w-full p-3 pr-12 border border-[#EDEDED] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0D6ABE] focus:border-transparent transition-all duration-200"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <div className="absolute right-3 bottom-3 flex gap-1">
                  <button className="w-6 h-6 bg-[#F5F5F5] hover:bg-[#E5E7EB] rounded-full flex items-center justify-center transition-colors duration-200">
                    <Paperclip className="h-3 w-3 text-[#6B7280]" />
                  </button>
                </div>
                
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
                className="w-10 h-10 bg-[#FC4E46] hover:bg-[#E0453E] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Agent Selection Sheet */}
      {isAgentSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[80] transition-opacity duration-300" 
          onClick={() => setIsAgentSheetOpen(false)}
          aria-hidden="true"
        />
      )}

      {isAgentSheetOpen && (
        <div
          className="fixed top-0 right-0 h-full bg-white shadow-2xl z-[90] transform transition-all duration-300 ease-in-out w-[480px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agent-title"
        >
        <div className="flex flex-col h-full">
          {/* Agent Header */}
          <div className="bg-[#0D6ABE] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAgentSheetOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Back to compliance review"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 id="agent-title" className="text-lg font-semibold">Run Agent</h2>
                <p className="text-sm opacity-90">Select an AI agent to execute</p>
                      </div>
                    </div>
                  </div>

          {/* Agent List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {mockAgents.map((agent) => (
                <div key={agent.id} className="border border-[#EDEDED] rounded-lg p-4 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{agent.icon}</div>
                      <div>
                        <h3 className="font-semibold text-[#111111]">{agent.name}</h3>
                        <p className="text-sm text-[#4D4D4D]">{agent.description}</p>
                </div>
                    </div>
                    <Badge variant="outline" className="border-[#00BD6F] text-[#00BD6F] bg-[#F0F9F4]">
                      {agent.status}
                    </Badge>
              </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-[#6B7280] mb-2">Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.map((capability, index) => (
                        <span key={index} className="text-xs bg-[#F5F5F5] text-[#4D4D4D] px-2 py-1 rounded">
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleAgentRun(agent.id)}
                    className="w-full bg-[#0D6ABE] hover:bg-[#0B5AA1] text-white"
                  >
                    Run Agent
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Feedback Sheet */}
      {isFeedbackSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[80] transition-opacity duration-300" 
          onClick={() => setIsFeedbackSheetOpen(false)}
          aria-hidden="true"
        />
      )}

      {isFeedbackSheetOpen && (
        <div
          className="fixed top-0 right-0 h-full bg-white shadow-2xl z-[90] transform transition-all duration-300 ease-in-out w-[480px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
        <div className="flex flex-col h-full">
          {/* Feedback Header */}
          <div className="bg-[#00BD6F] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                  <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFeedbackSheetOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Back to compliance review"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 id="feedback-title" className="text-lg font-semibold">Send Feedback</h2>
                <p className="text-sm opacity-90">Help us improve our service</p>
                    </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl transition-colors duration-200 ${
                        star <= feedbackForm.rating ? 'text-[#FFD13C]' : 'text-[#EDEDED]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Category</label>
                <select
                  value={feedbackForm.category}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BD6F] focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="ui">UI/UX Feedback</option>
                  <option value="performance">Performance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BD6F] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Message</label>
                <textarea
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 border border-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BD6F] focus:border-transparent"
                  rows={4}
                  placeholder="Tell us about your experience..."
                />
              </div>

              <Button
                onClick={handleFeedbackSubmit}
                className="w-full bg-[#00BD6F] hover:bg-[#00A85A] text-white"
                disabled={!feedbackForm.message.trim()}
              >
                Send Feedback
                  </Button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Quick Actions Sheet */}
      {isQuickActionsSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[80] transition-opacity duration-300" 
          onClick={() => setIsQuickActionsSheetOpen(false)}
          aria-hidden="true"
        />
      )}

      {isQuickActionsSheetOpen && (
        <div
          className="fixed top-0 right-0 h-full bg-white shadow-2xl z-[90] transform transition-all duration-300 ease-in-out w-[480px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-actions-title"
        >
        <div className="flex flex-col h-full">
          {/* Quick Actions Header */}
          <div className="bg-[#4D4D4D] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                  <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsQuickActionsSheetOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Back to compliance review"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 id="quick-actions-title" className="text-lg font-semibold">Quick Actions</h2>
                <p className="text-sm opacity-90">Common compliance tasks</p>
                    </div>
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Export Actions */}
              <div>
                <h3 className="text-sm font-semibold text-[#111111] mb-3">Export & Reports</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]">
                    <FileText className="w-4 h-4 mr-3" />
                    Export Compliance Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]">
                    <Download className="w-4 h-4 mr-3" />
                    Download PDF Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]">
                    <Share2 className="w-4 h-4 mr-3" />
                    Share with Team
                  </Button>
                </div>
              </div>

              {/* Analysis Actions */}
              <div>
                <h3 className="text-sm font-semibold text-[#111111] mb-3">Analysis & Validation</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-[#00BD6F] text-[#00BD6F] hover:bg-[#F0F9F4]">
                    <CheckCircle className="w-4 h-4 mr-3" />
                    Re-run Compliance Check
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#00BD6F] text-[#00BD6F] hover:bg-[#F0F9F4]">
                    <Eye className="w-4 h-4 mr-3" />
                    Validate All Findings
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#00BD6F] text-[#00BD6F] hover:bg-[#F0F9F4]">
                    <RefreshCw className="w-4 h-4 mr-3" />
                    Update Regulations
                  </Button>
                </div>
              </div>

              {/* Market Actions */}
              <div>
                <h3 className="text-sm font-semibold text-[#111111] mb-3">Multi-Market</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]">
                    <Globe className="w-4 h-4 mr-3" />
                    Check EU Compliance
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]">
                    <Shield className="w-4 h-4 mr-3" />
                    FDA Validation
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#0D6ABE] text-[#0D6ABE] hover:bg-[#F3F8FC]">
                    <BarChart3 className="w-4 h-4 mr-3" />
                    Market Analysis
                  </Button>
                </div>
              </div>

              {/* Support Actions */}
              <div>
                <h3 className="text-sm font-semibold text-[#111111] mb-3">Support & Resources</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-[#4D4D4D] text-[#4D4D4D] hover:bg-[#F5F5F5]">
                    <BookOpen className="w-4 h-4 mr-3" />
                    Compliance Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#4D4D4D] text-[#4D4D4D] hover:bg-[#F5F5F5]">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#4D4D4D] text-[#4D4D4D] hover:bg-[#F5F5F5]">
                    <Users className="w-4 h-4 mr-3" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Generate Report Sheet */}
      {isGenerateReportSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[80] transition-opacity duration-300" 
          onClick={() => setIsGenerateReportSheetOpen(false)}
          aria-hidden="true"
        />
      )}

      {isGenerateReportSheetOpen && (
        <div
          className="fixed top-0 right-0 h-full bg-white shadow-2xl z-[90] transform transition-all duration-300 ease-in-out w-[480px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="generate-report-title"
        >
        <div className="flex flex-col h-full">
          {/* Generate Report Header */}
          <div className="bg-[#0D6ABE] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                  <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsGenerateReportSheetOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Back to compliance review"
              >
                <ArrowLeft className="h-4 w-4" />
                  </Button>
              <div>
                <h2 id="generate-report-title" className="text-lg font-semibold">Generate Report</h2>
                <p className="text-sm opacity-90">Create a compliance report</p>
              </div>
            </div>
          </div>

          {/* Report Generation Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Report Title */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Report Title</label>
                <input
                  type="text"
                  value={reportForm.title}
                  onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6ABE] focus:border-transparent"
                  placeholder="Compliance Report"
                />
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-3">Report Format</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'pdf', name: 'PDF', icon: '📄', desc: 'Standard PDF format' },
                    { id: 'excel', name: 'Excel', icon: '📊', desc: 'Spreadsheet format' },
                    { id: 'word', name: 'Word', icon: '📝', desc: 'Editable document' },
                    { id: 'html', name: 'HTML', icon: '🌐', desc: 'Web format' }
                  ].map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setReportForm(prev => ({ ...prev, format: format.id }))}
                      className={`p-3 border rounded-lg text-left transition-all duration-200 ${
                        reportForm.format === format.id
                          ? 'border-[#0D6ABE] bg-[#F3F8FC] text-[#0D6ABE]'
                          : 'border-[#EDEDED] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="text-lg mb-1">{format.icon}</div>
                      <div className="font-medium text-sm">{format.name}</div>
                      <div className="text-xs text-[#6B7280]">{format.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Include Options */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-3">Include in Report</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={reportForm.includeImages}
                      onChange={(e) => setReportForm(prev => ({ ...prev, includeImages: e.target.checked }))}
                      className="w-4 h-4 text-[#0D6ABE] border-[#EDEDED] rounded focus:ring-[#0D6ABE]"
                    />
                    <span className="text-sm text-[#111111]">Screenshots and images</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={reportForm.includeCharts}
                      onChange={(e) => setReportForm(prev => ({ ...prev, includeCharts: e.target.checked }))}
                      className="w-4 h-4 text-[#0D6ABE] border-[#EDEDED] rounded focus:ring-[#0D6ABE]"
                    />
                    <span className="text-sm text-[#111111]">Charts and visualizations</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={reportForm.includeRecommendations}
                      onChange={(e) => setReportForm(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                      className="w-4 h-4 text-[#0D6ABE] border-[#EDEDED] rounded focus:ring-[#0D6ABE]"
                    />
                    <span className="text-sm text-[#111111]">Recommendations and next steps</span>
                  </label>
                </div>
              </div>

              {/* Email Delivery */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Email Report To (optional)</label>
                <input
                  type="email"
                  value={reportForm.email}
                  onChange={(e) => setReportForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6ABE] focus:border-transparent"
                  placeholder="team@company.com"
                />
              </div>

                  <Button
                onClick={handleReportGenerate}
                className="w-full bg-[#0D6ABE] hover:bg-[#0B5AA1] text-white"
                  >
                      Generate Report
              </Button>
                    </div>
          </div>
        </div>
      </div>
      )}

      {/* Share with Team Sheet */}
      {isShareTeamSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[80] transition-opacity duration-300" 
          onClick={() => setIsShareTeamSheetOpen(false)}
          aria-hidden="true"
        />
      )}

      {isShareTeamSheetOpen && (
        <div
          className="fixed top-0 right-0 h-full bg-white shadow-2xl z-[90] transform transition-all duration-300 ease-in-out w-[480px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-team-title"
        >
        <div className="flex flex-col h-full">
          {/* Share with Team Header */}
          <div className="bg-[#FC4E46] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShareTeamSheetOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Back to compliance review"
              >
                <ArrowLeft className="h-4 w-4" />
                  </Button>
              <div>
                <h2 id="share-team-title" className="text-lg font-semibold">Share with Team</h2>
                <p className="text-sm opacity-90">Collaborate on compliance results</p>
              </div>
            </div>
          </div>

          {/* Share Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Team Members</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-[#EDEDED] rounded-lg p-3">
                  {mockTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        shareForm.selectedMembers.includes(member.id)
                          ? 'bg-[#FC4E46]/10 border border-[#FC4E46]/30'
                          : 'hover:bg-[#F9F9F9]'
                      }`}
                      onClick={() => handleMemberToggle(member.id)}
                    >
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-10 h-10 bg-gradient-to-br from-[#FC4E46] to-[#E0453E] rounded-full flex items-center justify-center"><span class="text-sm font-semibold text-white">${member.name.split(' ').map(n => n[0]).join('')}</span></div>`;
                            }
                          }}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === 'online' ? 'bg-[#00BD6F]' :
                          member.status === 'away' ? 'bg-[#FFD13C]' :
                          'bg-[#6B7280]'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#111111] text-sm truncate">{member.name}</h4>
                          {shareForm.selectedMembers.includes(member.id) && (
                            <div className="w-4 h-4 bg-[#FC4E46] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] truncate">{member.role}</p>
                        <p className="text-xs text-[#4D4D4D] truncate">{member.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#6B7280] mt-2">
                  {shareForm.selectedMembers.length} member{shareForm.selectedMembers.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Message (optional)</label>
                <textarea
                  value={shareForm.message}
                  onChange={(e) => setShareForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 border border-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC4E46] focus:border-transparent"
                  rows={3}
                  placeholder="Add a message to accompany the shared results..."
                />
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-3">Access Permissions</label>
                <div className="space-y-2">
                  {[
                    { id: 'view', name: 'View Only', desc: 'Can view but not edit' },
                    { id: 'comment', name: 'Comment', desc: 'Can view and add comments' },
                    { id: 'edit', name: 'Edit', desc: 'Can view and edit results' }
                  ].map((permission) => (
                    <label key={permission.id} className="flex items-center gap-3 p-3 border border-[#EDEDED] rounded-lg hover:bg-[#F9F9F9] cursor-pointer">
                      <input
                        type="radio"
                        name="permissions"
                        value={permission.id}
                        checked={shareForm.permissions === permission.id}
                        onChange={(e) => setShareForm(prev => ({ ...prev, permissions: e.target.value }))}
                        className="w-4 h-4 text-[#FC4E46] border-[#EDEDED] focus:ring-[#FC4E46]"
                      />
                      <div>
                        <div className="font-medium text-sm text-[#111111]">{permission.name}</div>
                        <div className="text-xs text-[#6B7280]">{permission.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notification Options */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={shareForm.notify}
                    onChange={(e) => setShareForm(prev => ({ ...prev, notify: e.target.checked }))}
                    className="w-4 h-4 text-[#FC4E46] border-[#EDEDED] rounded focus:ring-[#FC4E46]"
                  />
                  <span className="text-sm text-[#111111]">Send email notification to recipients</span>
                </label>
              </div>

                  <Button
                onClick={handleShareSubmit}
                className="w-full bg-[#FC4E46] hover:bg-[#E0453E] text-white"
                disabled={shareForm.selectedMembers.length === 0}
                  >
                      Share with Team
              </Button>
                    </div>
          </div>
        </div>
      </div>
      )}

      {/* Expert Marketplace Sheet */}
      {isConsultantSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[80] transition-opacity duration-300" 
          onClick={() => setIsConsultantSheetOpen(false)}
          aria-hidden="true"
        />
      )}

      {isConsultantSheetOpen && (
        <div
          className="fixed top-0 right-0 h-full bg-white shadow-2xl z-[90] transform transition-all duration-300 ease-in-out w-[480px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consultant-title"
        >
        <div className="flex flex-col h-full">
          {/* Expert Header */}
          <div className="bg-[#8B5CF6] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView === 'profile' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProfileClose}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                  aria-label="Back to experts"
                >
                  <ArrowLeft className="h-4 w-4" />
                  </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsConsultantSheetOpen(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                  aria-label="Back to compliance review"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h2 id="consultant-title" className="text-lg font-semibold">
                  {currentView === 'profile' ? 'Expert Profile' : 'Engage Expert'}
                </h2>
                <p className="text-sm opacity-90">
                  {currentView === 'profile' ? 'Detailed expert information' : 'Vetted compliance experts'}
                </p>
                </div>
              </div>
            </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pb-16">
            {currentView === 'consultants' ? (
              <div className="p-6">
                <div className="space-y-4">
                  {/* Filter Tabs */}
                  <div className="flex gap-2 mb-6">
                    {[
                      { id: 'all', label: 'All', count: mockConsultants.length },
                      { id: 'immediate', label: 'Immediate', count: mockConsultants.filter(c => c.availability === 'immediate').length },
                      { id: '2-days', label: '2 Days', count: mockConsultants.filter(c => c.availability === '2-days').length },
                      { id: '7-days', label: '7 Days', count: mockConsultants.filter(c => c.availability === '7-days').length }
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                          consultantForm.urgency === filter.id
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-[#F5F5F5] text-[#4D4D4D] hover:bg-[#E5E7EB]'
                        }`}
                        onClick={() => setConsultantForm(prev => ({ ...prev, urgency: filter.id }))}
                      >
                        {filter.label} ({filter.count})
                      </button>
                    ))}
          </div>

                  {/* Expert Cards */}
                  {mockConsultants
                    .filter(consultant => 
                      consultantForm.urgency === 'all' || consultant.availability === consultantForm.urgency
                    )
                    .map((consultant) => (
                    <div key={consultant.id} className="border border-[#EDEDED] rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-white">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm ring-2 ring-white">
                            <img
                              src={consultant.avatarUrl}
                              alt={consultant.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-full flex items-center justify-center"><span class="text-lg font-semibold text-white">${consultant.name.split(' ').map(n => n[0]).join('')}</span></div>`;
                                }
                              }}
                            />
        </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#111111] text-base">{consultant.name}</h3>
                              {consultant.verified && (
                                <div className="w-4 h-4 bg-[#00BD6F] rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
      </div>
                              )}
                            </div>
                            <p className="text-sm text-[#4D4D4D] font-medium">{consultant.title}</p>
                            <p className="text-xs text-[#6B7280]">{consultant.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#8B5CF6]">{consultant.rate}</div>
                          <div className="text-xs text-[#6B7280] font-medium">{consultant.responseTime}</div>
                        </div>
                      </div>
                      
                      {/* Availability & Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          consultant.availability === 'immediate' 
                            ? 'bg-[#00BD6F] text-white'
                            : consultant.availability === '2-days'
                            ? 'bg-[#FFD13C] text-[#111111]'
                            : 'bg-[#6B7280] text-white'
                        }`}>
                          {consultant.availability === 'immediate' ? 'Available Now' : 
                           consultant.availability === '2-days' ? '2-Day Turnaround' : '7-Day Turnaround'}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#FFD13C] text-sm">★</span>
                          <span className="font-semibold text-sm">{consultant.rating}</span>
                          <span className="text-[#6B7280] text-xs">({consultant.reviews})</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {consultant.specialties.slice(0, 3).map((specialty, index) => (
                            <span key={index} className="text-xs bg-[#F8F9FA] text-[#4D4D4D] px-2.5 py-1 rounded-full font-medium">
                              {specialty}
                            </span>
                          ))}
                          {consultant.specialties.length > 3 && (
                            <span className="text-xs text-[#6B7280] px-2.5 py-1">
                              +{consultant.specialties.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#4D4D4D] mb-4 leading-relaxed line-clamp-2">
                        {consultant.description}
                      </p>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-xs text-[#6B7280] mb-4">
                        <span>{consultant.experience} experience</span>
                        <span>{consultant.location}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleConsultantEngage(consultant.id)}
                          className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          Engage Now
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F3F0FF] font-medium py-2.5 rounded-lg transition-all duration-200"
                          onClick={() => handleProfileOpen(consultant)}
                        >
                          Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Profile View */
              <div className="h-full">
                {/* Profile Banner */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={selectedProfile?.avatarUrl}
                    alt={selectedProfile?.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Profile Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-end gap-4">
                      {/* Profile Avatar */}
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl">
                        <img
                          src={selectedProfile?.avatarUrl}
                          alt={selectedProfile?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Profile Details */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h1 className="text-2xl font-bold">{selectedProfile?.name}</h1>
                          {selectedProfile?.verified && (
                            <div className="w-5 h-5 bg-[#00BD6F] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-lg text-white/90 mb-1">{selectedProfile?.title}</p>
                        <p className="text-sm text-white/80">{selectedProfile?.company}</p>
                        
                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[#FFD13C]">★</span>
                            <span className="font-semibold">{selectedProfile?.rating}</span>
                            <span className="text-white/80 text-sm">({selectedProfile?.reviews})</span>
                          </div>
                          <div className="font-semibold">{selectedProfile?.rate}</div>
                          <div className="text-white/80 text-sm">{selectedProfile?.experience} exp</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6 space-y-6">
                  {/* About Section */}
                  <div>
                    <h2 className="text-xl font-bold text-[#111111] mb-3">About</h2>
                    <p className="text-[#4D4D4D] leading-relaxed mb-4">
                      {selectedProfile?.description}
                    </p>
                    
                    {/* Location & Availability */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#F8F9FA] p-4 rounded-lg">
                        <h3 className="font-semibold text-[#111111] mb-2">Location & Availability</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                            <span className="text-[#4D4D4D]">{selectedProfile?.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00BD6F] rounded-full"></div>
                            <span className="text-[#4D4D4D]">Response: {selectedProfile?.responseTime}</span>
                          </div>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            selectedProfile?.availability === 'immediate' 
                              ? 'bg-[#00BD6F] text-white'
                              : selectedProfile?.availability === '2-days'
                              ? 'bg-[#FFD13C] text-[#111111]'
                              : 'bg-[#6B7280] text-white'
                          }`}>
                            {selectedProfile?.availability === 'immediate' ? 'Available Now' : 
                             selectedProfile?.availability === '2-days' ? '2-Day Turnaround' : '7-Day Turnaround'}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#F8F9FA] p-4 rounded-lg">
                        <h3 className="font-semibold text-[#111111] mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedProfile?.languages.map((language: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full text-xs font-medium">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specialties Section */}
                  <div>
                    <h2 className="text-xl font-bold text-[#111111] mb-3">Specialties</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedProfile?.specialties.map((specialty: string, index: number) => (
                        <div key={index} className="bg-white border border-[#EDEDED] rounded-lg p-3 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                            <span className="font-medium text-[#111111] text-sm">{specialty}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience & Reviews */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#F8F9FA] p-4 rounded-lg">
                      <h3 className="font-semibold text-[#111111] mb-2">Experience</h3>
                      <div className="text-2xl font-bold text-[#8B5CF6] mb-1">{selectedProfile?.experience}</div>
                      <p className="text-[#4D4D4D] text-sm">of compliance expertise</p>
                    </div>

                    <div className="bg-[#F8F9FA] p-4 rounded-lg">
                      <h3 className="font-semibold text-[#111111] mb-2">Client Reviews</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-[#FFD13C]">★</span>
                        <span className="text-xl font-bold text-[#111111]">{selectedProfile?.rating}</span>
                        <span className="text-[#4D4D4D] text-sm">({selectedProfile?.reviews} reviews)</span>
                      </div>
                      <p className="text-[#4D4D4D] text-sm">Highly rated by clients</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleConsultantEngage(selectedProfile?.id)}
                      className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Engage Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleProfileClose}
                      className="px-6 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F3F0FF] font-medium py-3 rounded-lg transition-all duration-200"
                    >
                      Back to Experts
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      )}

    </div>
  )
}
