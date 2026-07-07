import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sparkles,
  PenLine,
  Type,
  Image,
  Palette,
  LayoutTemplate,
  Share2,
  Zap,
  Target,
  Shield,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const features = [
  {
    icon: PenLine,
    title: '智能编辑器',
    description: '所见即所得的富文本编辑，支持 AI 内联助手，实时手机预览',
  },
  {
    icon: Type,
    title: 'AI 标题引擎',
    description: '6 维度策略生成爆款标题，自动评分、违规检测、A/B 测试',
  },
  {
    icon: Image,
    title: 'AI 配图引擎',
    description: 'AI 生成匹配插图，智能素材匹配，封面图一键生成',
  },
  {
    icon: Palette,
    title: 'AI 排版引擎',
    description: '一键排版，专家规则引擎，6 种风格预设开箱即用',
  },
  {
    icon: LayoutTemplate,
    title: '风格管理中心',
    description: '品牌风格包管理，风格克隆，团队风格统一',
  },
  {
    icon: Share2,
    title: '多平台输出',
    description: '一键导出公众号、知乎、小红书、PDF 等 7+ 格式',
  },
]

const highlights = [
  { icon: Target, title: '风格统一', description: '每篇文章都是你的品牌脸' },
  { icon: Zap, title: '效率翻倍', description: '排版时间从 30 分钟降到 3 分钟' },
  { icon: Shield, title: '零门槛', description: '小白也能做出专业排版' },
]

const pricingPlans = [
  {
    name: '免费版',
    price: '¥0',
    period: '/月',
    features: ['5 篇文章/月', '10 次 AI 排版', '10 次 AI 标题', '3 张 AI 配图', '基础模板'],
    cta: '免费开始',
    popular: false,
  },
  {
    name: 'Pro',
    price: '¥29',
    period: '/月',
    features: ['无限文章', '300 次 AI 排版', '200 次 AI 标题', '100 张 AI 配图', '全部模板', '10 个风格包', '去水印'],
    cta: '升级 Pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '¥99',
    period: '/人/月',
    features: ['无限文章', '1000 次 AI 排版', '1000 次 AI 标题', '500 张 AI 配图', '全部模板 + 私有', '无限风格包', '团队协作', '去水印'],
    cta: '开始试用',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: '定制',
    period: '',
    features: ['无限使用', '品牌定制', '私有部署', '专属支持', 'API 接入'],
    cta: '联系我们',
    popular: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-50" />
          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI 驱动的公众号风格优化平台
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              从文字到爆款
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                一站式搞定
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              标题、配图、排版、风格 — 全流程 AI 助力，让你的每一篇文章都长着同一张脸：你的品牌脸。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/editor">
                <Button size="lg" className="gap-2 px-8">
                  <PenLine className="w-5 h-5" />
                  开始创作
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-8">
                  查看定价
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
              <p className="text-gray-600">六大 AI 能力，覆盖内容创作全链路</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们？</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {highlights.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">简单透明的定价</h2>
              <p className="text-gray-600">选择适合你的方案，随时升级或降级</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPlans.map((plan, i) => (
                <Card
                  key={i}
                  className={`p-6 relative ${
                    plan.popular ? 'border-blue-500 border-2' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      最受欢迎
                    </div>
                  )}
                  <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {feature}
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
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">准备好了吗？</h2>
            <p className="text-blue-100 mb-8">
              加入数千名创作者，开始你的高效创作之旅
            </p>
            <Link href="/editor">
              <Button size="lg" variant="secondary" className="px-8">
                免费开始
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}