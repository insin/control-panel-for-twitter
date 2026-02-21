.PHONY: all build build-mv2 build-mv3 install deploy clean help dev

EXTENSION_NAME := control-panel-for-twitter
EXTENSIONS_DIR := /Volumes/Shared/boot/extensions
TARGET_DIR := $(EXTENSIONS_DIR)/$(EXTENSION_NAME)

help: ## Show this help message
	@echo "Control Panel for Twitter - Build & Deploy"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build both MV2 and MV3 versions
	@echo "🔨 Building Control Panel for Twitter extension..."
	@npm run build > /dev/null

build-mv2: ## Build Manifest V2 version only
	@echo "🔨 Building Manifest V2 version..."
	@npm run build-mv2 > /dev/null

build-mv3: ## Build Manifest V3 version only
	@echo "🔨 Building Manifest V3 version..."
	@npm run build-mv3 > /dev/null

install: build deploy ## Build and deploy the extension

deploy: ## Deploy to $(TARGET_DIR)
	@echo "🚀 Deploying extension..."
	@./deploy.sh > /dev/null

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf web-ext-artifacts
	@rm -rf unpacked
	@rm -f manifest.json
	@rm -f browser_action.html
	@echo "✨ Clean complete!"

all: clean build deploy ## Clean, build, and deploy everything
	@echo "✅ All tasks complete!"
