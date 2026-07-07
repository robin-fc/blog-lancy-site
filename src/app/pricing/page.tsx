'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Zap, 
  Users, 
  Building2,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: '免费版',
    price: '¥0',
    period: '/月',
    desc: '个人尝鲜',
    icon: Sparkles,
    features: [
      { text: '5 篇文章/月', available: true },
      { text: '10 次 AI 排版', available: true },
      { text: '10 次 AI 标题', available: true },
      { text: '3 张 AI 配图', available: true },
      { text: '基础模板', available: true },
      { text: '1 个风格包', available: true },
      { text: '仅公众号导出', available: true },
      { text: '去水印', available: false },
    ],
    cta: '免费开始',
    popular: false,
  },
  {
    name: 'Pro',
    price: '¥29',
    period: '/月',
    desc: '个人创作者',
    icon: Zap,
    features: [
      { text: '无限文章', available: true },
      { text: '300 次 AI 排版', available: true },
      { text: '200 次 AI 标题', available: true },
      { text: '100 张 AI 配图', available: true },
      { text: '全部模板', available: true },
      { text: '10 个风格包', available: true },
      { text: '全平台导出', available: true },
      { text: '去水印', available: true },
    ],
    cta: '升级 Pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '¥99',
    period: '/人/月',
    desc: '内容团队',
    icon: Users,
    features: [
      { text: '无限文章', available: true },
      { text: '1000 次 AI 排版', available: true },
      { text: '1000 次 AI 标题', available: true },
      { text: '500 张 AI 配图', available: true },
      { text: '全部模板 + 私有', available: true },
      { text: '无限风格包', available: true },
      { text: '团队协作', available: true },
      { text: '权限管理', available: true },
    ],
    cta: '开始试用',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: '定制',
    period: '',
    desc: '企业定制',
    icon: Building2,
    features: [
      { text: '无限使用', available: true },
      { text: '品牌定制风格', available: true },
      { text: '私有部署', available: true },
      { text: 'API 接入', available: true },
      { text: '专属客户经理', available: true },
      { text: 'SLA 保障', available: true },
    ],
    cta: '联系我们',
    popular: false,
  },
]

const faqs = [
  {
    q: 'AI 排版是什么？',
    a: 'AI 排版是一键应用专家级排版规则的功能。我们会分析你的文章结构，自动优化段落间距、标题样式、引用格式等，让文章更易阅读。',
  },
  {
    q: 'AI 配图如何计费？',
    a: '每次生成一张图片计为 1 次 AI 配图使用。如果生成失败不计数。Pro 用户每月有 100 次额度，用完后可单独购买额度包。',
  },
  {
    q: '可以中途升级或降级吗？',
    a: '可以随时升级，升级后立即生效，剩余天数会按比例计算退款。降级会在当前周期结束后生效。',
  },
  {
    q: '导出的公众号 HTML 怎么使用？',
    a: '导出的 HTML 已经过原子化 CSS 处理，可以直接复制粘贴到公众号后台的编辑器中，样式会完美保留。',
  },
  {
    q: 'Team 版的协作功能有哪些？',
    a: 'Team 版支持多人实时协作、文章评论、版本历史、审批流程、权限管理等功能，适合有团队协作需求的用户。',
  },
  {
    q: '有发票吗？',
    a: '支持开具增值税普通发票和专用发票，开票金额为实际支付金额。',
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const getPrice = (basePrice: string) => {
    if (basePrice === '¥0' || basePrice === '定制') return basePrice
    const num = parseInt(basePrice.replace('¥', ''))
    if (billingCycle === 'yearly') {
      const yearly = Math.floor(num * 10) // 年付约 8.3 折
      return `¥${yearly}`
    }
    return basePrice
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-16">
          {/* 标题 */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">简单透明的定价</h1>
            <p className="text-gray-500">选择适合你的方案，随时升级或降级</p>
            
            {/* 计费周期切换 */}
            <div className="inline-flex items-center gap-2 mt-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  billingCycle === 'monthly' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                月付
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors relative',
                  billingCycle === 'yearly' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                年付
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-500 text-white text-[10px] rounded-full">
                  省 2 月
                </span>
              </button>
            </div>
          </div>

          {/* 定价卡片 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plans.map((plan, i) => {
              const Icon = plan.icon
              return (
                <Card
                  key={i}
                  className={cn(
                    'p-6 relative flex flex-col',
                    plan.popular 
                      ? 'border-blue-500 border-2 shadow-lg scale-105' 
                      : 'border border-gray-200'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      最受欢迎
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                      plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                    )}>
                      <Icon className={cn('w-5 h-5', plan.popular ? 'text-blue-600' : 'text-gray-500')} />
                    </div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.desc}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-0.5 mb-4">
                    <span className="text-3xl font-bold">{getPrice(plan.price)}</span>
                    <span className="text-gray-500">{billingCycle === 'yearly' && plan.price !== '定制' ? '/月' : plan.period}</span>
                  </div>
                  
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        {f.available ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={cn(f.available ? 'text-gray-600' : 'text-gray-400')}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Card>
              )
            })}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              常见问题
            </h2>
            
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <Card key={i} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.q}</span>
                    {expandedFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* 底部 CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-500 mb-4">还有疑问？</p>
            <Button variant="outline" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              联系客服
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}