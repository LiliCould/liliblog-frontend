import type { HeroCodeTemplate } from '~/types'

/**
 * Hero 打字机文案列表（本地兜底值）。
 * 线上内容以 /api/blog-config 为准；接口不可用时使用这里的默认值。
 */
export const heroPhrases: string[] = [
  '代码拯救世界!',
  'never foget to say hello world!',
  '计算机是一个大的世界，而编程语言是和这个世界交流的工具。',
  '永远相信美好的事情即将发生。',
  '让代码像诗一样优雅。',
  '像奇迹排序一般，相信奇迹总会发生。',
  '梦想遥不可及，追寻梦想的力量永不枯竭。',
  '立里可在努力，立里可在迷茫，立里可在成长',
  '世界是一台巨大的计算机，我们是组成它的元件。',
  '互联网从不缺乏天才，缺乏的是敢于追求梦想的勇气。',
]

/**
 * 编程语言模板：最终输出 = prefix + 文案 + suffix。
 */
export const heroCodeTemplates: HeroCodeTemplate[] = [
  { key: 'java', label: 'Java', prefix: 'System.out.println("', suffix: '");' },
  { key: 'javascript', label: 'JavaScript', prefix: 'console.log("', suffix: '");' },
  { key: 'typescript', label: 'TypeScript', prefix: 'console.log("', suffix: '");' },
  { key: 'python', label: 'Python', prefix: 'print("', suffix: '")' },
  { key: 'c', label: 'C', prefix: 'printf("', suffix: '\\n");' },
  { key: 'cpp', label: 'C++', prefix: 'std::cout << "', suffix: '" << std::endl;' },
  { key: 'csharp', label: 'C#', prefix: 'Console.WriteLine("', suffix: '");' },
  { key: 'go', label: 'Go', prefix: 'fmt.Println("', suffix: '")' },
  { key: 'rust', label: 'Rust', prefix: 'println!("', suffix: '");' },
  { key: 'kotlin', label: 'Kotlin', prefix: 'println("', suffix: '")' },
  { key: 'swift', label: 'Swift', prefix: 'print("', suffix: '")' },
]
