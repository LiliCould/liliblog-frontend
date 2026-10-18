/**
 * Hero 打字机文案列表。
 * 在这里增删即可，每行一句；打字机会随机挑一句，再随机套用一种编程语言模板。
 */
export const heroPhrases: string[] = [
  '代码拯救世界!',
  '永远不要忘记: say hello world!',
  '计算机是一个大的世界，而编程语言是和这个世界交流的工具。',
  '永远相信美好的事情即将发生。',
  '让代码像诗一样优雅。',
  '像奇迹排序一般，相信奇迹总会发生。',
  '梦想遥不可及，追寻梦想的力量永不枯竭。',
  '立里可在努力，立里可在迷茫，立里可在成长',
  '世界是一台巨大的计算机，我们是组成它的元件。',
  '互联网从不缺乏天才，缺乏的是敢于追求梦想的勇气。',
]

export interface HeroCodeTemplate {
  label: string
  prefix: string
  suffix: string
}

/**
 * 编程语言模板：最终输出 = prefix + 文案 + suffix。
 * 如需增加语言，按相同结构追加即可。
 */
export const heroCodeTemplates: HeroCodeTemplate[] = [
  { label: 'Java', prefix: 'System.out.println("', suffix: '");' },
  { label: 'JavaScript', prefix: 'console.log("', suffix: '");' },
  { label: 'TypeScript', prefix: 'console.log("', suffix: '");' },
  { label: 'Python', prefix: 'print("', suffix: '")' },
  { label: 'C', prefix: 'printf("', suffix: '\\n");' },
  { label: 'C++', prefix: 'std::cout << "', suffix: '" << std::endl;' },
  { label: 'C#', prefix: 'Console.WriteLine("', suffix: '");' },
  { label: 'Go', prefix: 'fmt.Println("', suffix: '")' },
  { label: 'Rust', prefix: 'println!("', suffix: '");' },
  { label: 'Kotlin', prefix: 'println("', suffix: '")' },
  { label: 'Swift', prefix: 'print("', suffix: '")' },
]
