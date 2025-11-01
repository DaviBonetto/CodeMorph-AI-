
import React from 'react';
import { TransformationOption, SampleCode } from './types';
import { Rocket, ShieldCheck, Accessibility, Smartphone, Zap, Wand2 } from './components/icons/LucideIcons';

export const TRANSFORMATION_OPTIONS: TransformationOption[] = [
  {
    id: 'Performance Boost',
    name: 'Performance Boost',
    subtitle: 'Optimize speed & memory',
    icon: <Rocket className="w-8 h-8" />,
    badge: 'Most Popular',
  },
  {
    id: 'Security Hardening',
    name: 'Security Hardening',
    subtitle: 'Fix vulnerabilities',
    icon: <ShieldCheck className="w-8 h-8" />,
  },
  {
    id: 'Accessibility',
    name: 'Accessibility',
    subtitle: 'Add WCAG compliance',
    icon: <Accessibility className="w-8 h-8" />,
  },
  {
    id: 'Mobile-First',
    name: 'Mobile-First',
    subtitle: 'Responsive design',
    icon: <Smartphone className="w-8 h-8" />,
  },
  {
    id: 'Modern Stack',
    name: 'Modern Stack',
    subtitle: 'Update to latest',
    icon: <Zap className="w-8 h-8" />,
  },
  {
    id: 'Best Practices',
    name: 'Best Practices',
    subtitle: 'Clean code patterns',
    icon: <Wand2 className="w-8 h-8" />,
  },
];

export const SAMPLES: SampleCode[] = [
    {
        language: 'javascript',
        code: `// Inefficient React component
function ProductList({ products }) {
  const [filtered, setFiltered] = React.useState(products);
  
  const filterProducts = (query) => {
    const result = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);
  };
  
  return (
    <div>
      <input onChange={(e) => filterProducts(e.target.value)} />
      {filtered.map(product => (
        <div key={product.id}>
          <img src={product.image} />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}`
    },
    {
        language: 'python',
        code: `# Inefficient data processing
def process_users(users):
    result = []
    for user in users:
        if user['age'] > 18:
            full_name = user['first_name'] + ' ' + user['last_name']
            result.append({
                'name': full_name,
                'email': user['email']
            })
    return result`
    }
];
