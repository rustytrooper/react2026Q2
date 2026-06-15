# Performance Optimization Report

## Baseline Measurements

### Interaction A: Sort countries

- **Commit duration**: 5.3 s
- **Render duration**: 1981.2 ms
- **Screenshot**: ![screenshot](/react-performance/screenshots/baseline/sortNotOptimized.jpg)

### Interaction B: Search countries

- **Commit duration**: 3.6 s
- **Render duration**: 403.1 ms
- **Screenshot**: ![screenshot](/react-performance/screenshots/baseline/searchCountryNotOptimized.jpg)

### Interaction C: Change year

- **Commit duration**: 8.4 s
- **Render duration**: 1875.5 ms
- **Screenshot**: ![screenshot](/react-performance/screenshots/baseline/year2010NotOptimiezed.jpg)

### Interaction D: Toggle column

- **Commit duration**: 3.1 s
- **Render duration**: 1674.6 ms
- **Screenshot**: ![screenshot](/react-performance/screenshots/baseline/columnToggleNotOptimized.jpg)

## Optimized Measurements

### Interaction A: Sort countries

- **Commit duration**: 1.4 s
- **Render duration**: 91.3 ms
- **Screenshot**: ![screenshot](/react-performance/screenshots/optimized/optimizedSort.jpg)

### Interaction B: Search countries

- **Commit duration**: 1.5 s
- **Render duration**: 27.5 ms
- **Screenshot**: ![screenshot](/react-performance/screenshots/optimized/searchOptimized.jpg)

### Interaction C: Change year

- **Commit duration**: 3 s
- **Render duration**: 102 ms
- **Screenshot**: ![screenshot](/react-performance/screenshots/optimized/yearSelectOptimized.jpg)

### Interaction D: Toggle column

- **Commit duration**: 0.4 s
- **Render duration**: 347.6 ms
- **Screenshot**: ![screenshot](/react-performance/screenshots/optimized/toggleOptimized.jpg)

## Summary of Improvements

| Interaction      | Baseline (ms) | Optimized (ms) | Improvement |
| ---------------- | ------------- | -------------- | ----------- |
| Sort countries   | 5300          | 1400           | 73,6%       |
| Search countries | 3600          | 1500           | 58,3%       |
| Change year      | 8400          | 3000           | 64,29%      |
| Toggle column    | 3100          | 400            | 88%         |
| **Average**      | **5100**      | **1575**       | **69,12%**  |
