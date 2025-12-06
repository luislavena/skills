SKILLS_DIR := skills
DIST_DIR := dist
SKILL_DIRS := $(wildcard $(SKILLS_DIR)/*)

.PHONY: list all clean

list:
	@echo "Available skills:"
	@for skill_dir in $(SKILL_DIRS); do \
		if [ -f "$$skill_dir/SKILL.md" ]; then \
			echo "  - $$(basename $$skill_dir)"; \
		fi; \
	done

all: $(DIST_DIR)
	@for skill_dir in $(SKILL_DIRS); do \
		skill_name=$$(basename $$skill_dir); \
		if [ -f "$$skill_dir/SKILL.md" ]; then \
			echo "Building $$skill_name.zip..."; \
			(cd $$skill_dir && zip -r ../../$(DIST_DIR)/$$skill_name.zip \
				SKILL.md references/ scripts/); \
		fi; \
	done

$(DIST_DIR):
	mkdir -p $(DIST_DIR)

clean:
	rm -rf $(DIST_DIR)
