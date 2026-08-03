## PR #: <!-- e.g. PR #2 -->
## Module: <!-- e.g. Course & Lesson Management -->

### Summary
<!-- 1-2 sentences: what this PR adds/changes -->

---

### 1. Database Schema Changes
<!-- Tables created/modified, foreign key relations, and indexing choices -->
-

### 2. API Specifications
<!-- Queries/mutations added or changed, and how authorization is applied to them -->
-

### 3. RBAC & Restrictions Verification
<!-- Who can access each query/mutation, and how unauthorized attempts are rejected -->
- **Admin:**
- **Instructor:**
- **Student:**
- **Unauthorized/unauthenticated behavior:**

### 4. Edge Case Handling
<!-- Invalid parameters, non-existent records, duplicate requests, network errors -->
- Invalid input:
- Non-existent record:
- Duplicate request:
- Network/server error:

---

### Notes
<!-- Anything extra to add -->

### Checklist
- [ ] Code follows RBAC rules defined in PRD
- [ ] Endpoints tested for all 3 roles + unauthenticated
- [ ] No sensitive data (e.g. quiz answer keys) leaked in API responses
- [ ] Edge cases handled gracefully
- [ ] Branch is up to date with `main`