- [DATA PICK](#data-pick)
  - [安装](#%e5%ae%89%e8%a3%85)
  - [使用方法](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)
    - [创建实体类(两种声明方式选一种)](#%e5%88%9b%e5%bb%ba%e5%ae%9e%e4%bd%93%e7%b1%bb%e4%b8%a4%e7%a7%8d%e5%a3%b0%e6%98%8e%e6%96%b9%e5%bc%8f%e9%80%89%e4%b8%80%e7%a7%8d)
      - [1.创建class声明文件](#1%e5%88%9b%e5%bb%baclass%e5%a3%b0%e6%98%8e%e6%96%87%e4%bb%b6)
      - [class声明的方法使用](#class%e5%a3%b0%e6%98%8e%e7%9a%84%e6%96%b9%e6%b3%95%e4%bd%bf%e7%94%a8)
      - [2.创建`JSON`声明文件](#2%e5%88%9b%e5%bb%bajson%e5%a3%b0%e6%98%8e%e6%96%87%e4%bb%b6)
      - [json声明的方法使用](#json%e5%a3%b0%e6%98%8e%e7%9a%84%e6%96%b9%e6%b3%95%e4%bd%bf%e7%94%a8)
  - [使用场景举例](#%e4%bd%bf%e7%94%a8%e5%9c%ba%e6%99%af%e4%b8%be%e4%be%8b)

# DATA PICK

> 本工具是针对后台返回的数据对象字段太多，直接在页面中使用，严重的话则会发生页面渲染和交互的性能问题，这里提供一种解决方案，只需要创建基础类（列出需要用到的字段），最终返回的就是基础类对应的数据结构。当然你也可以使用[`loadsh`-`pick/omit`](http://lodash.think2011.net/pick)，甚至是[`GraphQL`](https://graphql.org.cn/)来解决你的问题。

> 相对于`loadsh`的`pick`方法而言，不能一次性直接处理嵌套的数据结构。

> 相对于`GraphQL`而言，需要前后端都需要修改代码，这样就造成了开发成本、效率明显的增加。

> 支持声明文件是`class`关键字声明

> 支持声明文件是`json`声明

## 安装

```bash
npm i data_pick
```

## 使用方法

### 创建实体类(两种声明方式选一种)

> 注意：如果有字段属性是对象或是数组，必须提供返回属性值类型的方法（如果数组中的元素是js基本类型的除外）需要添加获取`class`类型的**get**方法，**方法名命名为：固定前缀+字段名**

#### 1.创建class声明文件

- 商品类`ProductBean.js`（第一层级）
```javascript
import { PREFIX_BEAN } from 'data_pick';
import SkuBean from './SkuBean.js';

/**
 * 商品类
 */
export default class ProductBean {
   id;
   name;
   imgs;
   bbSkus;
   discountPrice;
   /* 如果有第二层级的类属性，需要额外添加的方法，重点！重点！重点！ */
   get [`${PREFIX_BEAN}bbSkus`]() {
      return SkuBean;
   }
}

```

- 商品里的sku类`SkuBean.js`（第二层级）
```javascript
/**
 * 商品sku类
 */
export default class SkuBean {
   id;
   skuLossId;
   minUnit;
}
```

#### class声明的方法使用
```javascript
import { dataPick } from 'data_pick';
import ProductBean from 'ProductBean'; // 第一步声明的class

// metadata 是需要处理的元数据
// 如果有多层嵌套关系，调用只需要传入顶层的声明对象
// class关键字声明的类
const data = dataPick(metadata,ProductBean)
```



#### 2.创建`JSON`声明文件

- 商品类`ProductJson.js`（第一层级）
```javascript
import { PREFIX_BEAN } from 'data_pick';
import SkuJson from './SkuJson.js';

export default {
   id: null,
   name: null,
   imgs: null,
   bbSkus: null,
   discountPrice: null,
   /* 如果有第二层级的json类型，需要额外添加的方法，重点！重点！重点！ */
   get [`${PREFIX_BEAN}bbSkus`]() {
      return SkuJson;
   }
};

```

- 商品里的sku类`SkuJson.js`（第二层级）
```javascript
/**
 * 商品sku类
 */
export default {
   id: null,
   skuLossId: null,
   minUnit: null
};
```

#### json声明的方法使用
```javascript
import { dataPick } from 'data_pick';
import ProductJson from 'ProductJson'; // 第一步声明的ProductJson

// metadata 是需要处理的元数据
// 如果有多层嵌套关系，调用只需要传入顶层的声明对象
// json对象声明的数据
const data = dataPick(metadata,jsonBean)
```

## 使用场景举例

1. 在未使用数据筛选的性能情况
![在未使用数据筛选的性能情况](https://jeno.oss-cn-shanghai.aliyuncs.com/web/npm/low_performance.gif)

2. 使用数据筛选后的性能情况
![使用数据筛选后的性能情况](https://jeno.oss-cn-shanghai.aliyuncs.com/web/npm/high_performance.gif)

