'use client';

import { Select } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface SortSelectorProps {
  currentSort: string;
}

export default function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortValue, setSortValue] = useState(currentSort);

  useEffect(() => {
    setSortValue(currentSort);
  }, [currentSort]);

  const sortOptions = [
    { value: 'editions', label: 'Most Editions' },
    { value: 'old', label: 'Oldest First' },
    { value: 'new', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Title A-Z' },
  ];

  const handleSortChange = (value: string) => {
    setSortValue(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/books/search?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <Select
        value={sortValue}
        onChange={handleSortChange}
        style={{ width: 200 }}
        placeholder="Sort by"
      >
        {sortOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
